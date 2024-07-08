import { AppService } from 'src/modules/app/app.service';
import { type LoaderFunctionArgs } from "@remix-run/node";
export declare class IndexBackend {
    private readonly appService;
    constructor(appService: AppService);
    loader(args: LoaderFunctionArgs, req: Request, name?: string): {
        message: string;
    };
    setMessage(body: {
        message: string;
    }): Promise<{
        newMessage: string;
    }>;
}
