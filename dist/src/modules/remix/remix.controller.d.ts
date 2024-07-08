import type { NextFunction, Request, Response } from 'express';
import { ModuleRef } from "@nestjs/core";
import { AppLoadContext } from "@remix-run/node";
import { type RemixConfig } from "./remix.config";
export interface RemixLoadContext extends AppLoadContext {
    moduleKey: string;
    moduleRef: ModuleRef;
    req: Request;
    res: Response;
    next: NextFunction;
}
export declare class RemixController {
    private readonly remixConfig;
    private readonly build;
    private moduleRef;
    constructor(remixConfig: RemixConfig, build: any, moduleRef: ModuleRef);
    handler(req: Request, res: Response, next: NextFunction): Promise<void>;
}
