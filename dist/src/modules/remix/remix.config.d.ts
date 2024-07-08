import type { ValueProvider } from "@nestjs/common";
import type { ServeStaticModuleOptions } from "@nestjs/serve-static";
export declare const REMIX_CONFIG = "REMIX_CONFIG";
export declare const buildRemixConfigProvider: (config?: RemixConfig) => ValueProvider;
export type RemixConfig = {
    publicDir: string;
    browserBuildDir: string;
    remixServerDir?: string;
    staticDirs?: ServeStaticModuleOptions[];
    useCustomController?: string;
    isStaticAsset?: (request: Request) => boolean;
};
