module.exports = {
  name: 'frontend-data-access-api',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/frontend/data-access/api',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
