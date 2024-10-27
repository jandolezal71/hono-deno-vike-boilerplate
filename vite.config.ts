import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import type { UserConfig } from 'vite';
import deno from "@deno/vite-plugin";

import 'react';
import 'react-dom/client';

const config: UserConfig = {
	plugins: [
		deno(), react(), vike()
	],
};

export default config;
