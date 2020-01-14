import { strings } from '@angular-devkit/core';
import { chain, Rule, SchematicContext, SchematicsException, Tree, template, mergeWith, apply, url, renameTemplateFiles, branchAndMerge } from '@angular-devkit/schematics';
import { addExportsToBarrelFile } from '../../schematic-utils/add-to-barrel-file.schematics.util';
import { applyAndMergeTemplates } from '../../schematic-utils/apply-templates.schematics.util';

interface Schema {
  name: string;
}

// Meta schematics for generating schematics
export default function (options: Schema): Rule {

  return chain([
    applyAndMergeTemplates({ ...options }),
  ]);
}
