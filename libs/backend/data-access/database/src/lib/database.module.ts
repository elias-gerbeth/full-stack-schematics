import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { allEntities } from './all-entities';
import { allQueryServices } from './all-queries';

@Module({
    imports: [
        TypeOrmModule.forFeature(allEntities),
    ],
    providers: allQueryServices,
    exports: allQueryServices,
})
export class BackendDataAccessDatabaseModule { }
