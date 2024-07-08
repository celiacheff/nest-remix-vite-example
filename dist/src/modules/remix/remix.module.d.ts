import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ViteDevServer } from 'vite';
import { RemixConfig } from "./remix.config";
export declare class RemixModule implements NestModule {
    static viteDevServer: ViteDevServer | null;
    constructor();
    static forRoot(metadata?: RemixConfig): Promise<DynamicModule>;
    configure(consumer: MiddlewareConsumer): void;
}
