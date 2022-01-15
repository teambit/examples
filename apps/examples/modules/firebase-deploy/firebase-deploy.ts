import { DeploymentProvider, DeployContext } from '@teambit/application';
import { Capsule } from '@teambit/isolator';
import glob from 'glob';
import { posix, sep, join } from 'path';
import { google } from 'googleapis';
import fs from 'fs';
import axios, { AxiosInstance } from 'axios';
import zlib from 'zlib';
import crypto from 'crypto';
import { getAccessToken } from './firebase-auth';

export class FirebaseDeploy implements DeploymentProvider {
  constructor(readonly JWT: string, readonly SITE_ID: string) {}
  readonly publicDir = 'public';
  private accessToken: string;
  private axiosFb: AxiosInstance;
  private siteVersionUrl: string;
  // @ts-ignore
  async deploy(context: DeployContext, capsule: Capsule): Promise<void> {
    const filePaths = this.getFilePaths(capsule);
    const filesToUpload = await this.prepareFilesForUpload(filePaths);
    // this.accessToken = await getAccessToken(this.JWT);
    // this.axiosFb = axios.create({
    //   headers: { Authorization: `Bearer ${this.accessToken}` },
    //   baseURL: 'https://firebasehosting.googleapis.com/v1beta1',
    // });
    // this.siteVersionUrl = await this.createSiteVersion();
    this.specifyFilesToUpload(filesToUpload);
  }

  private getFilePaths(capsule: Capsule): string[] {
    const publicPath = join(capsule.path, this.publicDir);
    const filePaths = glob.sync(`${publicPath}/**`, { nodir: true });
    return filePaths;
  }

  private async prepareFilesForUpload(filePaths) {
    const gzip = zlib.createGzip();
    const filesToUpload = await Promise.all(
      filePaths.map(async (filePath) => {
        const publicDirSection = `${sep}${this.publicDir}${sep}`;
        const absSrcPathToOriginal = filePath;
        const absSrcPathToGZip = `${filePath}.gz`;
        let relDestPathToGzip = `${sep}${
          absSrcPathToGZip.split(publicDirSection)[1]
        }`;
        if (relDestPathToGzip.includes('\\')) {
          relDestPathToGzip = relDestPathToGzip.split(sep).join(posix.sep);
        }
        const readStream = fs.createReadStream(absSrcPathToOriginal);
        const writeStream = fs.createWriteStream(absSrcPathToGZip);
        readStream.pipe(gzip).pipe(writeStream);
        const { gZipFile, gZipFileHash } = await this.getFileContentAndHash(
          writeStream,
          absSrcPathToGZip
        );
        return {
          gZipFile,
          gZipFileHash,
          relDestPathToGzip,
        };
      })
    );
    return filesToUpload;
  }

  private getFileContentAndHash(
    writeStream: fs.WriteStream,
    filePath: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      writeStream.on('close', async () => {
        const gZipFile = await fs.promises.readFile(filePath, {
          encoding: 'binary',
        });
        const gZipFileHash = crypto
          .createHash('sha256')
          .update(gZipFile)
          .digest('hex');
        resolve({ gZipFile, gZipFileHash });
      });
    });
  }

  private async createSiteVersion() {
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

    try {
      const response = await this.axiosFb.post(
        `sites/${this.SITE_ID}/versions`,
        data
      );
      return response.data.name as string;
    } catch (err) {
      console.log(err);
    }
  }

  private async specifyFilesToUpload(filesToUpload) {
    const files = filesToUpload.map((fileToUpload) => {
      const file = {};
      Object.assign(file, {
        [fileToUpload.relDestPathToGzip]: fileToUpload.gZipFileHash,
      });
      return file;
    });
    console.log('>>> MAPPED FILES: ', files);
    // try {
    //   const response = await this.axiosFb.post(
    //     `${this.siteVersionUrl}:populateFiles`,
    //     files
    //   );
    //   return response.data;
    // } catch (err) {
    //   console.log(err);
    // }
  }
}
