import { chain, externalSchematic, Rule, SchematicContext, Tree, url, apply, template, applyTemplates, renameTemplateFiles, branchAndMerge, mergeWith, SchematicsException, move } from '@angular-devkit/schematics';
import { strings, normalize, experimental } from '@angular-devkit/core';
import { applyAndMergeTemplates } from '../../schematic-utils/apply-templates.schematics.util';

interface Schema {
  name: string;
  project?: string;
}

export default function (options: Schema): Rule {

  if (!options.project) {
    options.project = 'web-app';
  }

  const path = `libs/frontend/features/${strings.dasherize(options.name)}/src/lib`;

  return chain([
    // generate lib
    externalSchematic('@nrwl/angular', 'lib', {
      name: 'frontend/features/' + options.name,
      style: 'scss'
    }),
    // remove generated default modules (replaced by template module)
    removeGeneratedDefaultLibModules(options),

    // Copy templated files for frontend module with list and detail components and ngxs state
    applyAndMergeTemplates({ ...options, path, entityName: options.name }),

    // adjust barrel file
    (t: Tree) => {
      const barrelPath = `libs/frontend/features/${strings.dasherize(options.name)}/src/index.ts`;
      t.overwrite(barrelPath, `export * from './lib/${strings.dasherize(options.name)}.module';`);
      return t;
    },

    // lazy load in app routes
    lazyLoadInAppRoutes(options),
  ]);
}

const removeGeneratedDefaultLibModules = (options: Schema) => {
  return (t: Tree, context: SchematicContext) => {
    const pathToDel1 = `libs/frontend/features/${strings.dasherize(options.name)}/src/lib/frontend-features-${strings.dasherize(options.name)}.module.ts`;
    t.delete(pathToDel1);
    const pathSpec = `libs/frontend/features/${strings.dasherize(options.name)}/src/lib/frontend-features-${strings.dasherize(options.name)}.module.spec.ts`;
    t.delete(pathSpec);
    return t;
  };
};

const lazyLoadInAppRoutes = (options: Schema) => {
  return (tree: Tree, context: SchematicContext) => {
    const path = `apps/${options.project}/src/app/app.routes.ts`;
    if (!tree.exists(path)) {
      throw new SchematicsException('App Routes file not found: ' + path);
    }
    let content = tree.read(path).toString();
    const lazyLoad = `
  {
    path: '${strings.dasherize(options.name)}',
    loadChildren: () => import('@web-app/frontend/features/${strings.dasherize(options.name)}').then(m => m.FrontendFeature${strings.classify(options.name)}Module),
    // canActivate: [AuthGuard]
  },
`;
    content = content.replace(/];\s*$/, lazyLoad + '\n];\n');
    tree.overwrite(path, content);
    return tree;
  };
};