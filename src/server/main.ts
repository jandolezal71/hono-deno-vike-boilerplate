import { Hono } from '@hono/hono';
import { logger } from '@hono/hono/logger';
import { renderPage } from 'vike/server';

import { root } from '~server/root.ts';

async function startServer() {
	const app = new Hono();

	const vite = await import('vite');
	const viteDevMiddleware = (
		await vite.createServer({
			root,
			server: { middlewareMode: true },
		})
	).middlewares;

	app
		.use('*', logger())
		.use('*', async (context, next) => {
			await new Promise((resolve) => {
				viteDevMiddleware(context.req, context.res, resolve);
			});

			await next();
		})
		.use('*', async (context, next) => {
			const pageContext = await renderPage({ urlOriginal: context.req.url, headersOriginal: context.req.header() });

			const { httpResponse } = pageContext;

			if (!httpResponse) {
				await next();
			} else {
				context.status(httpResponse.statusCode);

				httpResponse.headers.forEach(([key, value]) => context.header(key, value));

				return context.body(httpResponse.body);
			}
		});

	app.onError((err, context) => {
		console.error(`${err}`);
		return context.text('Custom Error Message', 500);
	});

	const port = Number.parseInt(Deno.env.get('PORT') ?? '8080', 10);

	Deno.serve({ port, hostname: '0.0.0.0' }, app.fetch);
}

startServer();
