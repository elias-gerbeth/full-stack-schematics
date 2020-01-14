import Auth from '@aws-amplify/auth';

// the region and api gateway id will be replaced by serverless post deploy:prod script for this .production file
const region = 'us-east-1';
const apiUrl = 'http://localhost:3000';
const userPoolId = 'us-east-1_uMNRGxN9g'; // TODO: setup manually!
const userPoolWebClientId = '459g5v8k4u0e2eh2fcg476j63g'; // TODO: setup manually!

// add global prefix "/api/"
const backendUrl = apiUrl + '/api/';

export const customHeaderFunc = async () => {
  return { Authorization: /* 'Bearer ' + */ (await Auth.currentSession()).getIdToken().getJwtToken() };
};

export const environment = {
  amplify: {
    Auth: {
      // identityPoolId: '************',
      region,
      userPoolId,
      userPoolWebClientId,
      mandatorySignIn: true,
      authenticationFlowType: 'USER_SRP_AUTH',
    },
    API: {
      endpoints: [
        {
          name: 'api',
          endpoint: backendUrl,
          custom_header: customHeaderFunc,
        }
      ]
    },
    // AWSS3: {
    //   bucket: '',
    //   region: 'us-east-1'
    // },
  },
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

