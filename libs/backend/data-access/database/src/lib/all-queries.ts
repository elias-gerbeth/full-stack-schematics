import * as QueryServices from './query-services';

export const allQueryServices = Object.keys(QueryServices).map(k => QueryServices[k]);
