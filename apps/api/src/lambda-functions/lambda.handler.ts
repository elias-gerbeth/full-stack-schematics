import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Context, Handler } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
import * as express from 'express';
import { Server } from 'http';
import { ApiModule } from './lambda.module';
if (process.env.NODE_ENV === 'dev') { config({ path: '.env.dev' }); }

let cachedServer: Server;
async function bootstrapServer(): Promise<Server> {
  console.log('bootstrapping new lambda server');
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(ApiModule, adapter, { bodyParser: false });
  app.use(bodyParser.json({ limit: '1mb' }));
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.init();
  return await awsServerlessExpress.createServer(expressApp);
}

export const handler: Handler = async (event: any, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!cachedServer) {
    const server = await bootstrapServer();
    cachedServer = server;
  }
  return new Promise(resolve =>
    awsServerlessExpress.proxy(cachedServer, event, {
      ...context,
      succeed: resolve,
    }));
};
