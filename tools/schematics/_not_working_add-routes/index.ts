import { chain, externalSchematic, Rule, Tree, SchematicContext, apply, url, filter, SchematicsException, schematic } from '@angular-devkit/schematics';
import { strings, normalize, experimental } from '@angular-devkit/core';
import {
  getProjectFromWorkspace,
  getWorkspace,
} from 'schematics-utilities';

interface Schema {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  featureName: string;
  name?: string;

  // only generated right now
  inputType?: string;
  outputType?: string;
  methodName?: string;
}

/*
Goal: I don't have to think about controller paths, module imports, frontend api service, input/output param interface definitions, even controller implementations.
I only think about: I need a new backend access route, method, feature-name (=module).

Ideas for later (really!): Even make a GUI for this or let it be defined by a kinda json fine granularily defined generator that can show, add and remove routes. Generate swagger for routes in typeorm. generate routes that integrate with DB entities (CRUD) easily. Generate frontend components, connect a route to a action in NGXS. Add state and / or CRUD operations (actions) in NGXS.

INPUTS: 
  - feature name: Backend Feature Module name (libs/backend/features/xxxx)
  - Method: GET (default) POST (=UPDATE) PUT(=SET instead UPDATE) DELETE
  - route name (dasherized => will be path in controller and name for DTOs)

- add api interface file with interfaces for input and result + export
- add route in backend feature module controller (libs/backend/features/xxxxx/src/lib/): Method
- 
*/
export default function (options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const featureNameDash = strings.dasherize(options.featureName);
    // Check if feature module exists
    const backendFeatureModulePath = `libs/backend/features/${featureNameDash}`;
    if (!tree.getDir(backendFeatureModulePath)) {
      throw new SchematicsException('❌ Backend feature model ' + backendFeatureModulePath + ' does not exist!');
    }

    // generate route name if not set
    if (!options.name) {
      options.name = strings.dasherize(options.featureName) + '-' + strings.dasherize(options.method);
    }

    // generate input and output type
    options.inputType = strings.classify(options.featureName) + strings.classify(options.name) + 'InputDto';
    options.outputType = strings.classify(options.featureName) + strings.classify(options.name) + 'ResultDto';

    options.methodName = strings.camelize(options.name);


    return chain([
      schematic('feature-api-interfaces', { name: options.name }),
      schematic('feature-frontend-api-service', { name: options.name }),
      addRouteToController(options),
      addFunctionToControllerService(options),
    ]);
  }
}

function addRouteToController(options: Schema) {
  const featureNameDash = strings.dasherize(options.featureName);
  return (tree: Tree, context: SchematicContext): Tree => {
    const controllerPath = `libs/backend/features/${featureNameDash}/src/lib/${featureNameDash}.controller.ts`;
    if (!tree.exists(controllerPath)) {
      throw new SchematicsException('❌ controller did not already exist for feature at ' + controllerPath);
    }
    let content = tree.read(controllerPath).toString();
    const route = featureNameDash;

    const paramType = options.method === 'GET' ? 'Query' : 'Body';

    // insert import for ApiInterfaces
    if (!content.includes('ApiInterfaces')) {
      content = `import * as ApiInterfaces from '@api-interfaces';\n` + content;
    }

    const insert = `
  @${strings.capitalize(options.method.toLowerCase())}('${route}')
  async ${options.methodName}(@${paramType}() input: ApiInterfaces.${options.inputType}): Promise<ApiInterfaces.${options.outputType}> {
    return await this.service.${options.methodName}(input);
  }
    `;
    tree.overwrite(controllerPath, content.replace(/\}\s*$/gi, insert + '\n}'));
    return tree;
  };
}

function addFunctionToControllerService(options: Schema) {
  const featureNameDash = strings.dasherize(options.featureName);
  return (tree: Tree, context: SchematicContext): Tree => {
    const servicePath = `libs/backend/features/${featureNameDash}/src/lib/${featureNameDash}.service.ts`;
    if (!tree.exists(servicePath)) {
      throw new SchematicsException('❌ controller service did not already exist for feature at ' + servicePath);
    }
    let content = tree.read(servicePath).toString();
    const route = featureNameDash;

    // insert import for NotImplementedException
    if (!content.includes('NotImplementedException')) {
      content = `import { NotImplementedException } from '@nestjs/common';\n` + content;
    }
    // insert import for ApiInterfaces
    if (!content.includes('ApiInterfaces')) {
      content = `import * as ApiInterfaces from '@api-interfaces';\n` + content;
    }

    const insert = `
  async ${options.methodName}(input: ApiInterfaces.${options.inputType}): Promise<ApiInterfaces.${options.outputType}> {
    throw new NotImplementedException();
  }
  `;

    tree.overwrite(servicePath, content.replace(/\}\s*$/gi, insert + '\n}'));
    return tree;
  };
}
