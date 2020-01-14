var jwkToPem = require('jwk-to-pem');
var fetch = require('node-fetch');

// Downloads jwk & pem from: https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
async function main() {
  const userPoolId = process.argv[2];
  if (!userPoolId) {
    console.error('no user pool id! enter user pool id as first parameter to script');
    return false;
  }
  const region = 'us-east-1';
  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const result = await fetch(url).then(r => r.json());
  const jwk = result.keys[0];

  console.log(jwk);

  // const jwk = {
  //     "alg": "RS256",
  //     "e": "AQAB",
  //     "kid": "FfLA+XS6ln4Azp4yv2T+8qDsGswmb7XKFIhIu6oXYIY=",
  //     "kty": "RSA",
  //     "n": "xbN3Rb5O_n5QL7ANoL8yFu_ce8vj_nd6YYeZxzrDKdMiaqa9pRepQIY17MSHpZ4jx5A7yWpoKpdQQ_9__mrLF-IjEsJOHjmmhrYLNkzmUZtB2JHk3k2o8t_KhvmCcuRHWaZjnPJrORzuGv-aibFAIuzYXtFhvvlVGDQEhkKsu_ZLFPa-X5g8z7OkLOj79gKRIq6JcpXKdmNO1zAkhBYuKywsIK0s4KrumyZct2uDf5rrfoKMWKediG_bn0gutNdo4XekVqKfOS4Uipq8i_5qk6esDmcMuLFvpQ2yUMb1TH6KmUS1Yi_Y_vgnVNekVhFLmMuIHQ77UdMDvExE1jaxRQ",
  //     "use": "sig"
  // };

  var pem = jwkToPem(jwk);
  console.log(pem);
  console.log('for insertion with \\n: \n');
  const toEnv = pem.split('\n').join('\\n');
  console.log(toEnv);
  return toEnv;
}
main();
