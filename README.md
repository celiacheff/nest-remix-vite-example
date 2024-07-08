### Nest + Remiv + Vite PoC</h1>

Using NestJS services as action and loader functions

The wireLoader and wireAction functions connect to the RemixModule-decorated module to get providers. By supplying these functions with the type to be used as the backend, nest-remix will route the request appropriately given the @Loader() and @Action() decorators. Services can be injected into the backend class as expected given their module hierarchy.

It is required to create a new file as the NestJS decorators will attempt to execute as client-side code otherwise, breaking your build. As such, you will need two files for a route now (sorry!) - {your-route}.tsx and {your-route}.server.ts (you can name it whatever you want, but this is the recommended naming convention).

Note: backends must be provided/exported to be accessible by the RemixModule-decorated module.

```ts
// src/app/routes/hello-world.tsx
import type {
    ActionFunction,
    LoaderFunction
}
    from '@remix-run/node';
import {
    Form,
    useActionData,
    useLoaderData
}
    from '@remix-run/react';
import {
    wireAction,
    wireLoader
}
    from 'nest-remix/core.server';
import {
    HelloWorldBackend
}
    from './hello-world.server';

export const loader: LoaderFunction = (args) = >wireLoader(HelloWorldBackend, args);

export const action: ActionFunction = (args) = >wireAction(HelloWorldBackend, args);

export
default
function HelloWorld() {
    const {
        message
    } = useLoaderData < HelloWorldBackend['getMessage'] > ();
    const actionData = useActionData < HelloWorldBackend['setMessage'] | HelloWorldBackend['setMessageFallback'] > ();

    return ( < div style = {
    {
        fontFamily: 'system-ui, sans-serif',
            lineHeight: '1.4'
    }
} > <h1 > Welcome to Remix < /h1>
    <div style={{ marginTop: 20 }}>{actionData?.newMessage || message}</div > <fieldset style = {
    {
        marginTop: 20
    }
} > <legend > Update the message < /legend>
<Form method="post">
<input type="text" name="message" defaultValue={''} / > <button > Post update < /button>
</Form > <Form method = "put" > <input type = "text"name = "message"defaultValue = {
''
}
/>
<button>Put update</button > </Form>
</fieldset > </div>
)
```

```ts
// src/app/routes/hello-world.server.ts
import {
    Body,
    Injectable,
    ParseIntPipe,
    Query
}
    from '@nestjs/common';
import {
    LoaderFunctionArgs
}
    from '@remix-run/node';
import {
    Action,
    Loader,
    RemixArgs
}
    from 'nest-remix';
import {
    AppService
}
    from './app.service.ts';

@Injectable() export class HelloWorldBackend {
    constructor(private readonly appService: AppService);

    @Loader() getMessage(@Query('defaultMessage') defaultMessage: string, @Query('counter', ParseIntPipe) _counter: number, @RemixArgs() _remixArgs: LoaderFunctionArgs) {
        return {
            message: defaultMessage || this.appService.getDefaultMessage()
        };
    }

    @Action() async setMessageFallback(@Body() body: {
        message: string
    }) {
        return {
            newMessage: body.message + ' [POST, DELETE]'
        };
    }

    @Action.Put() async setMessage(@Body() body: {
        message: string
    }) {
        return {
            newMessage: body.message + ' [PUT]'
        };
    }
}
```

action Routing
The @Action() decorator will capture all requests to the wired action function. Additional routing is possible by using @Action.Post(), @Action.Put(), and @Action.Delete(). It will always fall back to @Action() if an HTTP verb is not supplied.