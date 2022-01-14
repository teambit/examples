import { DeploymentProvider, DeployContext } from '@teambit/application';
import { Capsule } from '@teambit/isolator';
import glob from 'glob';
import { posix, sep, join } from 'path';
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
    absSrcPathToOriginal: string;
    absSrcPathToGZip: string;
    relDestPathToGzip: string;
  }
];

export class FirebaseDeploy implements DeploymentProvider {
  constructor(readonly JWT: string, readonly SITE_ID: string) {}
  readonly publicDir = 'public';

  // @ts-ignore
  async deploy(context: DeployContext, capsule: Capsule): Promise<void> {
    const filePaths = this.getFilePaths(capsule);
    const filesToUpload = await this.prepareFilesForUpload(filePaths);
    // const accessToken = await getAccessToken(this.JWT);
    // const siteVersionUrl = await this.createSiteVersion(accessToken);
  }

  private getFilePaths(capsule: Capsule): string[] {
    const publicPath = join(capsule.path, this.publicDir);
    const filePaths = glob.sync(`${publicPath}/**`, { nodir: true });
    return filePaths;
  }

  private async prepareFilesForUpload(filePaths) {
    const filesToUpload: FilesToUpload = filePaths.map((filePath) => {
      const publicDirSection = `${sep}${this.publicDir}${sep}`;
      const absSrcPathToOriginal = filePath;
      const absSrcPathToGZip = `${filePath}.gz`;
      let relDestPathToGzip = absSrcPathToGZip.split(publicDirSection)[1];
      if (relDestPathToGzip.includes('\\')) {
        relDestPathToGzip = relDestPathToGzip.split(sep).join(posix.sep);
      }
      return {
        gZipFile: '',
        gZipFileHash: '',
        absSrcPathToOriginal,
        absSrcPathToGZip,
        relDestPathToGzip,
      };
    });
    console.log('>>> FILES TO UPLOAD: ', filesToUpload);
    // compress files and generate hashes
    const gzip = zlib.createGzip();
    filesToUpload.forEach((file) => {
      const rs = fs.createReadStream(file.absSrcPathToOriginal);
      const wr = fs.createWriteStream(file.absSrcPathToGZip);
      rs.pipe(gzip).pipe(wr);
      file.gZipFile = fs.readFileSync(file.absSrcPathToGZip, {
        encoding: 'utf8',
      });
      file.gZipFileHash = crypto
        .createHash('sha256')
        .update(file.gZipFile)
        .digest('base64');
    });
    console.log('FILES TO UPLOAD W/ GZIP: ', filesToUpload);
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
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}
