import type {ValueProvider} from "@nestjs/common";
import type {ServeStaticModuleOptions} from "@nestjs/serve-static";
import * as path from "path";

export const REMIX_CONFIG = "REMIX_CONFIG";

export const buildRemixConfigProvider = (config?: RemixConfig) => {
  return {
    provide: REMIX_CONFIG,
    useValue: {
      publicDir: config?.publicDir || path.join(__dirname, "public"),
      browserBuildDir: config?.browserBuildDir || path.join(
        process.cwd(), "./dist/client"
      ),
      remixServerDir: config?.remixServerDir ?? path.join(
        process.cwd(), "./dist/routes/server"
      ),
      useCustomController: config?.useCustomController ?? "RemixController",
      isStaticAsset: config?.isStaticAsset,
    } as RemixConfig,
  } as ValueProvider;
};

export type RemixConfig = {
  publicDir: string;
  browserBuildDir: string;
  remixServerDir?: string;
  staticDirs?: ServeStaticModuleOptions[];
  useCustomController?: string;
  isStaticAsset?: (request: Request) => boolean;
};
