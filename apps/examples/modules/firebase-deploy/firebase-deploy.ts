import { DeploymentProvider, DeployContext } from '@teambit/application';
import { Capsule } from '@teambit/isolator';
import glob from 'glob';
import { posix, sep, join } from 'path';
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
    this.accessToken = await getAccessToken(this.JWT);
    this.axiosFb = axios.create({
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    this.siteVersionUrl = await this.createSiteVersion();
    const uploadUrl = await this.specifyFilesToUpload(filesToUpload);
    const uploadFilesRes = await this.uploadFiles(filesToUpload, uploadUrl);
    // const finalizeVersionRes = this.finalizeVersion();
    // const deployVerRes = this.deployVersion();
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
          absSrcPathToGZip,
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
        `https://firebasehosting.googleapis.com/v1beta1/sites/${this.SITE_ID}/versions`,
        data
      );
      return response.data.name as string;
    } catch (err) {
      console.log(err);
    }
  }

  private async specifyFilesToUpload(filesToUpload) {
    const files = {};
    filesToUpload.forEach((fileToUpload) => {
      Object.assign(files, {
        [fileToUpload.relDestPathToGzip]: fileToUpload.gZipFileHash,
      });
    });
    const data = { files };
    try {
      const response = await this.axiosFb.post(
        `https://firebasehosting.googleapis.com/v1beta1/${this.siteVersionUrl}:populateFiles`,
        data
      );
      return response.data.uploadUrl as string;
    } catch (err) {
      console.log(err);
    }
  }

  private async uploadFiles(filesToUpload, uploadUrl) {
    filesToUpload.forEach(async (file) => {
      try {
        const response = await this.axiosFb.post(
          `${uploadUrl}/${file.gZipFileHash}`,
          file.gZipFile,
          {
            headers: {
              'Content-Type': 'application/octet-stream',
              'Content-Encoding': 'gzip',
            },
          }
        );
        return response;
      } catch (err) {
        console.log(err);
      }
    });
  }

  private async finalizeVersion() {
    const data = { status: 'FINALIZED' };
    try {
      const response = await this.axiosFb.patch(
        `https://firebasehosting.googleapis.com/v1beta1/${this.siteVersionUrl}?update_mask=status`,
        data
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  private async deployVersion() {
    const versionId = this.siteVersionUrl.split('versions/')[1];
    try {
      const response = await this.axiosFb.post(
        `https://firebasehosting.googleapis.com/v1beta1/sites/${this.SITE_ID}/releases?versionName=sites/${this.SITE_ID}/versions/${versionId}`
      );
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}
