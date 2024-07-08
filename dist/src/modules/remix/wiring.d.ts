import { ClassProvider, ParamData, Type } from '@nestjs/common';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import type { Request, Response } from 'express';
export declare const getLoaderProviders: () => ClassProvider<any>[];
export declare const Loader: () => (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => void;
export declare function Action(): (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => void;
export declare namespace Action {
    var Post: () => (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => void;
    var Put: () => (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => void;
    var Patch: () => (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => void;
    var Delete: () => (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => void;
}
export type ExpressLoaderArgs = LoaderFunctionArgs & {
    req: Request;
    res: Response;
};
export type ExpressActionArgs = ActionFunctionArgs & {
    req: Request;
    res: Response;
};
export declare const RemixArgs: (data?: ParamData) => ParameterDecorator;
export declare function wireLoader<LoaderFnT extends (...args: any) => any>(backendFnOrType: LoaderFnT | Type, loaderArgs: LoaderFunctionArgs): Promise<ReturnType<LoaderFnT>>;
export declare function wireAction<ActionFnT extends (...args: any) => any>(backendFnOrType: ActionFnT | ActionFnT[] | Type, actionArgs: ActionFunctionArgs): Promise<ReturnType<ActionFnT>>;
