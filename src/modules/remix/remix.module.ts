import {DynamicModule, MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {RemixController} from './remix.controller';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'node:path';
import {ViteDevServer} from 'vite';
import {getLoaderProviders} from "./wiring";
import {AppService} from "../app/app.service";
import {buildRemixConfigProvider, RemixConfig} from "./remix.config";


@Module({
  controllers: [RemixController],
  providers: [AppService],
})
export class RemixModule implements NestModule {
  static viteDevServer: ViteDevServer | null = null;

  constructor() {
  }

  static async forRoot(metadata?: RemixConfig): Promise<DynamicModule> {
    let build = null;

    if (process.env.NODE_ENV !== 'production') {
      const vite = await import('vite');
      RemixModule.viteDevServer = await vite.createServer({server: {middlewareMode: true}});
      build = () => (RemixModule.viteDevServer as ViteDevServer).ssrLoadModule('virtual:remix/server-build');
    } else {
      // @ts-ignore
      build = await import('./build/server/index.js');
    }

    return {
      module: RemixModule,
      imports: [
        ServeStaticModule.forRoot({rootPath: metadata?.publicDir || join(__dirname, 'build', 'client')}),
      ],
      providers: [
        ...getLoaderProviders(),
        buildRemixConfigProvider(metadata),
        {
          provide: 'REMIX_BUILD',
          useValue: build,
        },
      ],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    if (RemixModule.viteDevServer) {
      consumer.apply(RemixModule.viteDevServer.middlewares).forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
    }
  }
}
