import { strings } from '@angular-devkit/core';
import { chain, Rule, SchematicContext, SchematicsException, Tree, template, mergeWith, apply, url, renameTemplateFiles, branchAndMerge } from '@angular-devkit/schematics';
import { addExportsToBarrelFile } from '../../schematic-utils/add-to-barrel-file.schematics.util';
import { applyAndMergeTemplates } from '../../schematic-utils/apply-templates.schematics.util';

interface Schema {
  name: string;
}

export default function (options: Schema): Rule {

  const basePath = 'libs/shared/api-interfaces/src';
  const path = `${basePath}/lib/${strings.dasherize(options.name)}/`;

  // Add export to barrel file
  const barrelFilePath = `${basePath}/index.ts`;
  const barrelFileRelativeExportPath = `./lib/${strings.dasherize(options.name)}/index`;

  return chain([
    applyAndMergeTemplates({ ...options, path }),
    addExportsToBarrelFile(barrelFilePath, [barrelFileRelativeExportPath]),
  ]);
}
