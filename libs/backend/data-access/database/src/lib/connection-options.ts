import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { allEntities } from './all-entities';

export const getConnectionOptionsFromEnv: () => TypeOrmModuleOptions = () => {
    const config = {
        name: 'default',
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        port: 5432,
        username: process.env.TYPEORM_USERNAME,
        database: process.env.TYPEORM_NAME,
        password: process.env.TYPEORM_PASSWORD,

        // TODO: remove for production, should be replaced with formal migrations once we're launched
        synchronize: process.env.TYPEORM_SYNC === 'true' || false,
        logging: process.env.TYPEORM_LOG === 'true',
        entities: allEntities,
    } as TypeOrmModuleOptions;

    if (process.env.STAGE !== 'production') {
        console.log('connection config', config);
    }
    return config;
}
