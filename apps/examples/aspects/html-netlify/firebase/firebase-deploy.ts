import axios from 'axios';
import { getAccessToken } from './firebase-auth';

const SITE_ID = 'html-demo-63a45';
let fullVersionId = '';

export const firebaseDeploy = async () => {
  // authorize
  const accessToken = await getAccessToken();

  // create site version
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

  axios
    .post(
      `https://firebasehosting.googleapis.com/v1beta1/sites/${SITE_ID}/versions`,
      data,
      config
    )
    .then((res) => (fullVersionId = res.data.name))
    .catch((err) => console.log(err));

  if (fullVersionId) {
  }

  // specify which files to deploy

  // upload files

  // update version to 'finalized'

  //
};

// firebaseDeploy();

// const firebase = new FirebaseDeploy(jwt, SITE_ID)

// firebase.deploy()

// const firebaseConfig = {
//     jwt,
//     site_id,

// }
