import {All, Controller, Inject, Next, Req, Res} from '@nestjs/common';
import {createRequestHandler, GetLoadContextFunction} from '@remix-run/express';
import type {NextFunction, Request, Response} from 'express';
import {ModuleRef} from "@nestjs/core";
import {AppLoadContext} from "@remix-run/node";
import {REMIX_CONFIG, type RemixConfig} from "./remix.config";

export interface RemixLoadContext extends AppLoadContext {
  moduleKey: string;
  moduleRef: ModuleRef;
  req: Request;
  res: Response;
  next: NextFunction;
}


@Controller('/')
export class RemixController {
  constructor(
    @Inject(REMIX_CONFIG) private readonly remixConfig: RemixConfig,
    @Inject('REMIX_BUILD') private readonly build: any,
    private moduleRef: ModuleRef) {
  }

  @All('*')
  handler(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

    const getLoadContext: GetLoadContextFunction = (req) => {
      return {
        moduleRef: this.moduleRef,
        req,
        res,
        next,
      };
    };

    return createRequestHandler({
      build: this.build,
      getLoadContext
    })(req, res, next);
  }
}
