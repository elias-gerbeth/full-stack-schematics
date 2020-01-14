import * as QueryServices from './query-services';

export const allQueryServices = Object.keys(QueryServices)
    .filter(k => typeof QueryServices[k] === 'function')
    .filter(k => k.includes('.query.service.ts'))
    .map(k => QueryServices[k]);
