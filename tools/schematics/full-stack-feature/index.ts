import { chain, externalSchematic, Rule, schematic } from '@angular-devkit/schematics';

interface Schema {
  name: string;
}

/*
This schematic will generate a whole feature, including:
Frontend lib: libs/frontend/<name>
Frontend module: <Name>FrontendModule (ProductFrontendModule)
Frontend List Component: <Name>ListComponent (ProductListComponent)
Frontend Details Component: <Name>DetailsComponent (ProductDetailsomponent)
Frontend State: +state/<name>.actions and +state/<name>.state
Api Interfaces: Load: Get<Name>ListDto and Get<Name>ListResultDto, Get<Name>DetailsDto and Get<Name>DetailsResultDto, save: Save<Name>Dto and Save<Name>ResultDto, remove: Remove<Name>Dto
Backend lib: libs/backend/<name>
Controller+Module+Service: <Name>BackendModule <Name>Controller <Name>ControllerService
Controller and service functions: getDetails(id), getList(page,perPage), save(obj), remove(id)
Entities: <Name>Entity with default primary generated uuid column "id"
QueryService: <Name>QueryService with functions like controller service

*/
export default function (options: Schema): Rule {
  return chain([

    schematic('backend-feature', {
      name: options.name
    }),

    schematic('feature-api-interfaces', {
      name: options.name
    }),

    schematic('feature-frontend-api-service', {
      name: options.name
    }),

    schematic('frontend-feature', {
      name: options.name
    }),

  ]);
}
