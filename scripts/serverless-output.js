const fs = require('fs');

const configFilePath = (stage) => `apps/web-app/src/environments/environment.${stage}.ts`;

function handler(data, serverless, options) {
  console.log('Received Stack Output', data);
  const stage = data.Stage;
  if (stage === 'dev') {
    console.log('skipped script for outputs, stage === dev');
    return;
  }
  const configFileName = configFilePath(stage);
  const fileContent = fs.readFileSync(configFileName).toString();
  const fileContentWithReplacements = fileContent
    .replace(/const region = '.*';/, `const region = '${data.Region}';`)
    .replace(/const apiUrl = '.*';/, `const apiUrl = '${data.BackendUrl}';`)
    .replace(/const userPoolId = '.*';/, `const userPoolId = '${data.CognitoUserPool}';`)
    .replace(/const userPoolWebClientId = '.*';/, `const userPoolWebClientId = '${data.CognitoUserPoolClient}';`);
  fs.writeFileSync(configFileName, fileContentWithReplacements);
}

module.exports = {
  handler
}
