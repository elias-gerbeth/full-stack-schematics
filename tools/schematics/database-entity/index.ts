import { strings, normalize, experimental } from '@angular-devkit/core';
import { chain, externalSchematic, Rule, SchematicsException, Tree, SchematicContext, apply, url, applyTemplates, move, mergeWith, branchAndMerge, template, renameTemplateFiles } from '@angular-devkit/schematics';
import { addExportsToBarrelFile } from '../../schematic-utils/add-to-barrel-file.schematics.util';
import { applyAndMergeTemplates } from '../../schematic-utils/apply-templates.schematics.util';

interface Schema {
  name: string;
}

/*
This will generate:
- create a folder in the database folder (libs/backend/data-access/database/src/lib/<name>)
- create a query service file at <name>/queries/<name>.query.service.ts
- create an entity class with a primary uuid column at <name>/entities/<name>.entity.ts
- add a line exporting the entity in entities.ts: export * from './<name>/entities/<name>.entities';
- add a line to export the query service in the export barrel file query-services.ts: export * from './<name>/queries/<name>.query.service';
- register the query service in the module: no action needed, works automatically via the barrel files
*/
export default function (options: Schema): Rule {
  return (tree: Tree) => {
    // ensure database module is correctly set up
    const databaseModule = tree.read('/libs/backend/data-access/database/src/lib/database.module.ts');
    if (!databaseModule) {
      throw new SchematicsException('Could not find database module in /libs/backend/data-access/database/src/lib/database.module.ts');
    }
    const nameDash = strings.dasherize(options.name);
    const dbRoot = '/libs/backend/data-access/database/src/lib';

    const entityBarrelFilePath = `/libs/backend/data-access/database/src/lib/entities.ts`;
    const exportRelativePathsEntity = `./${nameDash}/entities/${nameDash}.entity`;
    const queryServicesBarrelFilePath = `/libs/backend/data-access/database/src/lib/query-services.ts`;
    const exportRelativePathsQueries = `./${nameDash}/queries/${nameDash}.query.service`;

    return chain([
      applyAndMergeTemplates({ ...options, path: dbRoot }),
      addExportsToBarrelFile(entityBarrelFilePath, [exportRelativePathsEntity]),
      addExportsToBarrelFile(queryServicesBarrelFilePath, [exportRelativePathsQueries]),
    ]);
  };
}
