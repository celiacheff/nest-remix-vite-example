"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemixArgs = exports.Loader = exports.getLoaderProviders = void 0;
exports.Action = Action;
exports.wireLoader = wireLoader;
exports.wireAction = wireAction;
const common_1 = require("@nestjs/common");
const constants_1 = require("@nestjs/common/constants");
const route_paramtypes_enum_1 = require("@nestjs/common/enums/route-paramtypes.enum");
const context_utils_1 = require("@nestjs/core/helpers/context-utils");
const pipes_1 = require("@nestjs/core/pipes");
const remix_helper_1 = require("./remix.helper");
const getViewBackendTypeName = (backendFn) => Reflect.getMetadata('__viewBackendTypeName__', backendFn);
const setViewBackendTypeName = (backendFn, type) => Reflect.defineMetadata('__viewBackendTypeName__', type.name, backendFn);
const getViewBackendMethod = (backendFn) => Reflect.getMetadata('__viewBackendMethodName__', backendFn);
const setViewBackendMethod = (backendFn, methodName) => Reflect.defineMetadata('__viewBackendMethodName__', methodName, backendFn);
const getReqAndRes = (args) => {
    const res = args.context.res;
    const req = args.context.req;
    return { res, req };
};
const viewBackendMap = new Map();
const getLoaderProviders = () => Array.from(viewBackendMap.entries()).map(([typeName, config]) => {
    return {
        provide: `VIEWBACKEND_${typeName}`,
        useClass: config.type,
    };
});
exports.getLoaderProviders = getLoaderProviders;
const Loader = () => {
    return function (target, propertyKey, _descriptor) {
        const type = target.constructor;
        if (!viewBackendMap.has(type.name)) {
            viewBackendMap.set(type.name, {
                type: type,
            });
        }
        setViewBackendTypeName(target[propertyKey], type);
        viewBackendMap.set(type.name, {
            ...viewBackendMap.get(type.name),
            loaderMethods: [
                ...(viewBackendMap.get(type.name)?.loaderMethods || []),
                propertyKey,
            ],
        });
    };
};
exports.Loader = Loader;
const createActionFn = (method) => {
    return function (target, propertyKey, _descriptor) {
        const type = target.constructor;
        if (!viewBackendMap.has(type.name)) {
            viewBackendMap.set(type.name, {
                type: type,
            });
        }
        setViewBackendTypeName(target[propertyKey], type);
        setViewBackendMethod(target[propertyKey], method);
        viewBackendMap.set(type.name, {
            ...viewBackendMap.get(type.name),
            actionMethods: [
                ...(viewBackendMap.get(type.name)?.actionMethods || []),
                propertyKey,
            ],
        });
    };
};
function Action() {
    return createActionFn('ALL');
}
Action.Post = () => createActionFn('POST');
Action.Put = () => createActionFn('PUT');
Action.Patch = () => createActionFn('PATCH');
Action.Delete = () => createActionFn('DELETE');
function createRouteParamDecorator(paramtype) {
    return (data) => (target, key, index) => {
        if (!key)
            return;
        const args = Reflect.getMetadata(constants_1.ROUTE_ARGS_METADATA, target.constructor, key) ||
            {};
        Reflect.defineMetadata(constants_1.ROUTE_ARGS_METADATA, (0, common_1.assignMetadata)(args, paramtype, index, data), target.constructor, key);
    };
}
const REMIX_ARGS_METADATA_KEY = 99999;
exports.RemixArgs = createRouteParamDecorator(REMIX_ARGS_METADATA_KEY);
async function parseArgumentsAndPipe(viewbackInstance, functionName, moduleRef, req, args) {
    const metadata = new context_utils_1.ContextUtils().reflectCallbackMetadata(viewbackInstance, functionName, constants_1.ROUTE_ARGS_METADATA) || {};
    const pipesConsumer = new pipes_1.PipesConsumer();
    const functionParams = [];
    await Promise.allSettled(Object.entries(metadata).map(async ([key, xconfig]) => {
        const paramType = parseInt(key.split(':').shift());
        const config = xconfig;
        const argMetadata = {
            metatype: null,
            type: 'custom',
            data: config.data,
        };
        const pipes = config.pipes.map((pipe) => {
            if ((0, remix_helper_1.isConstructor)(pipe)) {
                return new pipe();
            }
            return pipe;
        });
        try {
            if (paramType === route_paramtypes_enum_1.RouteParamtypes.QUERY) {
                argMetadata.type = 'query';
                const query = req.query[config.data];
                functionParams[config.index] = await pipesConsumer.apply(query, argMetadata, pipes);
            }
            else if (paramType === route_paramtypes_enum_1.RouteParamtypes.PARAM) {
                argMetadata.type = 'param';
                const param = args.params[config.data];
                functionParams[config.index] = await pipesConsumer.apply(param, argMetadata, pipes);
            }
            else if (paramType === route_paramtypes_enum_1.RouteParamtypes.BODY) {
                argMetadata.type = 'body';
                if (config.data?.length) {
                    functionParams[config.index] = await pipesConsumer.apply(req.body[config.data], argMetadata, pipes);
                }
                else {
                    functionParams[config.index] = await pipesConsumer.apply(req.body, argMetadata, pipes);
                }
            }
            else if (paramType === REMIX_ARGS_METADATA_KEY) {
                functionParams[config.index] = args;
            }
        }
        catch (err) {
            functionParams[config.index] = undefined;
        }
    }));
    return functionParams;
}
async function wireBackendFn(actionOrLoader, viewBackendFn, args) {
    const moduleRef = args.context.moduleRef;
    const viewbackendConfig = viewBackendMap.get(getViewBackendTypeName(viewBackendFn));
    const { req } = getReqAndRes(args);
    const viewbackInstance = moduleRef.get(`VIEWBACKEND_${getViewBackendTypeName(viewBackendFn)}`);
    const functionName = viewBackendFn.name;
    if (actionOrLoader === 'loader') {
        if (!viewbackendConfig?.loaderMethods?.includes(functionName)) {
            throw new Error(`Couldn't find a loader with name ${functionName}`);
        }
    }
    else {
        if (!viewbackendConfig?.actionMethods?.includes(functionName)) {
            throw new Error(`Couldn't find an action with name ${functionName}`);
        }
    }
    const functionParams = await parseArgumentsAndPipe(viewbackInstance, functionName, moduleRef, req, args);
    return viewbackInstance[functionName](...functionParams);
}
function wireLoader(backendFnOrType, loaderArgs) {
    const type = backendFnOrType;
    const backendFn = backendFnOrType;
    if ((0, remix_helper_1.isConstructor)(type)) {
        const loaderMethodNames = viewBackendMap.get(type.name)?.loaderMethods;
        if (!loaderMethodNames?.[0]?.length) {
            throw new Error(`Could not find an @Loader wiring for the provided type ${type.name}.`);
        }
        return wireLoader(type.prototype[loaderMethodNames[0]], loaderArgs);
    }
    return wireBackendFn('loader', backendFn, loaderArgs);
}
function wireAction(backendFnOrType, actionArgs) {
    if (Array.isArray(backendFnOrType)) {
        const { req } = getReqAndRes(actionArgs);
        const routedActionFn = backendFnOrType.find((a) => getViewBackendMethod(a) === req.method) ||
            backendFnOrType.find((a) => getViewBackendMethod(a) === 'ALL');
        if (!routedActionFn) {
            throw new Error('Could not find an @Action wiring for the provided functions.');
        }
        return wireAction(routedActionFn, actionArgs);
    }
    const type = backendFnOrType;
    const backendFn = backendFnOrType;
    if ((0, remix_helper_1.isConstructor)(type)) {
        const actionMethodsNames = viewBackendMap.get(type.name)?.actionMethods;
        if (!actionMethodsNames?.[0]?.length) {
            throw new Error(`Could not find an @Loader wiring for the provided type ${type.name}.`);
        }
        const actionFns = actionMethodsNames.map((a) => type.prototype[a]);
        return wireAction(actionFns, actionArgs);
    }
    return wireBackendFn('action', backendFn, actionArgs);
}
//# sourceMappingURL=wiring.js.map