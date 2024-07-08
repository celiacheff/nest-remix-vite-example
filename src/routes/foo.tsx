import {Form, Link, useActionData} from "@remix-run/react";
import {IndexBackend} from "./.server/index.server";
import {useLoaderData} from "~/modules/remix/client";
import {ActionFunction, LoaderFunction} from "@remix-run/node";
import {wireAction, wireLoader} from "~/modules/remix/wiring";

export const loader: LoaderFunction = (args) => {
    return wireLoader(IndexBackend, args);
};

export const action: ActionFunction = async (args) => {
    return wireAction(IndexBackend, args);
}

export default function Index() {
    const data = useLoaderData<IndexBackend['loader']>();
    const actionData = useActionData<IndexBackend['setMessage']>();

    return (
        <div>
            <h2>Foo page</h2>
            {JSON.stringify(data)}
            <div>
                <button onClick={() => console.log("clicked")}>Click Me</button>
            </div>
            <br/>
            <h2>Test forms and actions</h2>
            <div style={{marginTop: 20}}>{actionData?.newMessage || ""}</div>
            <Form method="post">
                <input type="text" name="message" defaultValue={''}/>
                <button>Post update</button>
            </Form>
            <Link to="/bar">Go to Bar</Link>
        </div>
    );
}
