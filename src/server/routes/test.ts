import { Hono } from '@hono/hono';
import { getConnInfo } from '@hono/hono/deno';

export const route = new Hono().get('/test/:name', (context) => {
	const name = context.req.param('name');

	const info = getConnInfo(context);

	return context.json({
		name,
		info,
	});
});
