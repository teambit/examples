import axios from 'axios';
import zlib from 'zlib';
import fs from 'fs';
import { getAccessToken } from './firebase-auth';

const SITE_ID = 'html-demo-63a45';
let fullVersionId = '';

export async function firebaseDeploy(filePaths: string[], capsulePath: string) {
  // authorize
  const accessToken = await getAccessToken();
  const siteVersionName = await createSiteVersion(accessToken);
  //   if (fullVersionId) {
  //     // gzip files to upload
  //     const gzip = zlib.createGzip();
  //     const filesToUpload = [];
  //     filePaths.shift();
  //     filePaths.map((filePath) => {
  //       const gzippedFilePath = `${filePath}.gz`;
  //       console.log(
  //         '🚀 ~ file: firebase-deploy.ts ~ line 49 ~ filePaths.map ~ gzippedFilePath',
  //         gzippedFilePath
  //       );
  //       const input = fs.createReadStream(filePath);
  //       const output = fs.createWriteStream(gzippedFilePath);
  //       input.pipe(gzip).pipe(output);
  //     });
  //   } else {
  //     throw 'Site version is missing';
  //   }

  // specify which files to deploy

  // upload files

  // update site version to 'finalized'
}

async function createSiteVersion(accessToken) {
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
      `https://firebasehosting.googleapis.com/v1beta1/sites/${SITE_ID}/versions`,
      data,
      config
    );
    console.log('RESPONSE', response);
    return response;
  } catch (err) {
    console.log(err);
  }
}

async function compressFiles() {}
