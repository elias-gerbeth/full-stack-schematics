// Load dotenv from corresponding file (DEV only, in life environment is already in process.env)
// ----------------------------------------------------------------------------
import { config } from 'dotenv';
let dotEnvPath = '';
if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development') {
  dotEnvPath = '.env.dev';
} else if (process.env.NODE_ENV === 'offline_db_stage') {
  dotEnvPath = '.env.offline_db_stage';
} else if (process.env.NODE_ENV === 'dev-dbprod') {
  dotEnvPath = '.env.dev-dbprod';
}
const result = config({ debug: true, path: dotEnvPath });
if (!result) {
  throw new Error('Could not load environment');
}
//  ----------------------------------------------------------------------------

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, MiddlewareConsumer } from '@nestjs/common';

import { FeatureUserModule, AuthMiddleware } from '@backend/features/user';
import { getConnectionOptionsFromEnv } from '@backend/database';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => getConnectionOptionsFromEnv(),
    }),
    FeatureUserModule,
    // Import other feature modules here
  ],
  providers: []
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    // // Auth middleware first (Cognito JWT decode & verify)
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}
