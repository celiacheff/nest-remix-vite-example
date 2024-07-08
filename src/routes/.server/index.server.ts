import {Body, Injectable, Query, Req} from '@nestjs/common';
import {AppService} from 'src/modules/app/app.service';
import {type LoaderFunctionArgs} from "@remix-run/node";
import {Action, Loader, RemixArgs} from "src/modules/remix/wiring";
// import {RemixArgs, UseLoader} from "~/modules/remix/handlerDecorators2";
// import {Action, Loader} from "~/modules/remix/handler.decorators";

@Injectable()
export class IndexBackend {
  constructor(private readonly appService: AppService) {
  }

  @Loader()
  loader(
    @RemixArgs() args: LoaderFunctionArgs,
    @Req() req: Request,
    @Query("name") name?: string,
  ) {
    return { message: this.appService.getHello() + ', now: ' + Date.now() };
  }

  @Action()
  async setMessage(@Body() body: { message: string }) {
    return { newMessage: body.message + ' [POST, DELETE]' };
  }

  //
  // @Action.Patch()
  // patch() {
  //   return "[patch]: returned by server side";
  // }
  //
  // @Action.Delete()
  // delete() {
  //   return "[delete]: returned by server side";
  // }
}