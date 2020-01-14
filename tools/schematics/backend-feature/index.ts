import { strings, normalize, experimental } from '@angular-devkit/core';
import { chain, externalSchematic, Rule, SchematicsException, Tree, SchematicContext, apply, url, applyTemplates, move, mergeWith, branchAndMerge, template, renameTemplateFiles, schematic } from '@angular-devkit/schematics';
import { applyAndMergeTemplates } from '../../schematic-utils/apply-templates.schematics.util';
import { addExportsToBarrelFile as addExportsToBarrelFile } from '../../schematic-utils/add-to-barrel-file.schematics.util';

interface OptionsSchema {
  name: string;
  entityName?: string;
}

/*
This will generate:
- generate an entity by calling the schematic database-entity with name=options.entityName
- generate a backend feature lib with setup CRUD routes and service, including database module
*/
export default function (options: OptionsSchema): Rule {
  return (tree: Tree) => {
    // ensure database module is correctly set up for including later
    const databaseModule = tree.read('/libs/backend/data-access/database/src/lib/database.module.ts');
    if (!databaseModule) {
      throw new SchematicsException('Could not find database module in /libs/backend/data-access/database/src/lib/database.module.ts');
    }

    const nameDash = strings.dasherize(options.name);
    options.entityName = options.entityName || strings.classify(options.name);
    const backendFeaturesRoot = '/libs/backend/features';

    const path = backendFeaturesRoot + '/' + nameDash + '/src/lib/';

    return chain([
      externalSchematic('@nrwl/nest', 'lib', {
        name: 'backend/features/' + nameDash
      }),
      schematic('database-entity', {
        name: options.entityName,
      }),
      applyAndMergeTemplates({ ...options, path }),
      addExportsToBarrelFile(`${backendFeaturesRoot}/${nameDash}/src/lib/backend-features-${nameDash}.ts`, [`./${nameDash}.module`]),
    ]);
  };
}
