import { strings } from '@angular-devkit/core';
import { chain, Rule, SchematicContext, SchematicsException, Tree, template, mergeWith, apply, url, renameTemplateFiles, branchAndMerge } from '@angular-devkit/schematics';
import { addExportsToBarrelFile } from '../../schematic-utils/add-to-barrel-file.schematics.util';
import { applyAndMergeTemplates } from '../../schematic-utils/apply-templates.schematics.util';

interface Schema {
  name: string;

  // only generated right now
  inputType?: string;
  outputType?: string;
  methodName?: string;
}

export default function (options: Schema): Rule {

  // generate input and output type
  options.inputType = strings.classify(options.name) + strings.classify(options.name) + 'InputDto';
  options.outputType = strings.classify(options.name) + strings.classify(options.name) + 'ResultDto';

  options.methodName = strings.camelize(options.name);
  const path = `libs/frontend/data-access/api`;
  const endpointFolderPath = path + '/src/lib/endpoints';

  // Add export to barrel file
  const barrelFilePath = `${path}/src/index.ts`;
  const barrelFileExportRelativePath = `./lib/endpoints/${strings.dasherize(options.name)}.api.service`;

  return chain([
    applyAndMergeTemplates({ ...options, path: endpointFolderPath }),
    addExportsToBarrelFile(barrelFilePath, [barrelFileExportRelativePath]),
  ]);
}
