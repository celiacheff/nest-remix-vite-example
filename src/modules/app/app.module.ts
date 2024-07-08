import * as path from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import {Module} from "@nestjs/common";
import {RemixModule} from "../remix/remix.module";
import {IndexBackend} from "../../routes/.server/index.server";

@Module({
  imports: [RemixModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, IndexBackend],
})
export class AppModule {}
