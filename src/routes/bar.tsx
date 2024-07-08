import {Link} from "@remix-run/react";

export default function Index() {
	return (
		<div>
			<h2>Bar page</h2>
			<button onClick={() => console.log('clicked')}>Click Me</button>
			<Link to="/foo">Foo</Link>
		</div>
	);
}
