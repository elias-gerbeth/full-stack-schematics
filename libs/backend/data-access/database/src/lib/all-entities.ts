import * as Entities from './entities';

export const allEntities = Object.keys(Entities)
    .filter(k => typeof Entities[k] === 'function')
    .filter(k => k.includes('.entity.ts'))
    .map(k => Entities[k]);
