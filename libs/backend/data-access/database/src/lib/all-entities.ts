import * as Entities from './entities';

export const allEntities = Object.keys(Entities).map(k => Entities[k]);
