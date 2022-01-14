import { DeploymentProvider, DeployContext } from '@teambit/application';
import { Capsule } from '@teambit/isolator';
import { glob } from 'glob';
import { sep, join } from 'path';
import { google } from 'googleapis';
import fs from 'fs';
import axios from 'axios';
import zlib from 'zlib';
import crypto from 'crypto';
import { getAccessToken } from './firebase-auth';

type FilesToUpload = [
  {
    gZipFile: any;
    gZipFileHash: string;
    absSourcePathToOriginal: string;
    absSourcePathToGZip: string;
    relDestinationPathToGzip: string;
  }
];

export class FirebaseDeploy implements DeploymentProvider {
  constructor(readonly JWT_KEY: any, readonly SITE_ID: string) {}
  readonly publicDir = 'public';

  // @ts-ignore
  deploy(context: DeployContext, capsule: Capsule): Promise<void> {
    const filePaths = this.getFilePaths(capsule);
    const accessToken = getAccessToken(this.JWT_KEY);
    const siteVersionUrl = this.createSiteVersion(accessToken);
    const filesToUpload = this.prepareFilesForUpload(filePaths);
  }

  private getFilePaths(capsule: Capsule): string[] {
    const publicPath = join(capsule.path, this.publicDir);
    let filePaths = [];
    glob(`${publicPath}/**`, {}, function (er, files) {
      filePaths = files;
    });
    // remove item with path to parent directory
    filePaths.shift();
    return filePaths;
  }

  private async createSiteVersion(accessToken) {
    const data = {
      config: {
        headers: [
          {
            glob: '**',
            headers: {
              'Cache-Control': 'max-age=1800',
            },
          },
        ],
      },
    };

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    try {
      const response = await axios.post(
        `https://firebasehosting.googleapis.com/v1beta1/sites/${this.SITE_ID}/versions`,
        data,
        config
      );
      console.log('RESPONSE', response);
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  private async prepareFilesForUpload(filePaths) {
    const filesToUpload: FilesToUpload = filePaths.map((filePath) => {
      const publicDirSection = `${sep}${this.publicDir}${sep}`;
      const absSourcePathToOriginal = filePath;
      const absSourcePathToGZip = `${filePath}.gz`;
      const relDestinationPathToGzip =
        absSourcePathToGZip.split(publicDirSection)[1];
    });
    // compress files and generate hashes
    const gzip = zlib.createGzip();
    filesToUpload.forEach((file) => {
      const input = fs.createReadStream(file.absSourcePathToOriginal);
      const output = fs.createWriteStream(file.absSourcePathToGZip);
      input.pipe(gzip).pipe(output);
      file.gZipFile = fs.readFileSync(file.absSourcePathToGZip, 'utf8');
      file.gZipFileHash = crypto
        .createHash('sha256')
        .update(file.gZipFile)
        .digest('base64');
    });
  }
}
