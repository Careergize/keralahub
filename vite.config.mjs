import { defineConfig, loadEnv } from 'vite';
import {readFileSync} from 'node:fs';
import adminHandler from './api/admin.js';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  // The local .env is authoritative; old Vite versions left URLs in process.env.
  let localUrl;
  try {
    localUrl = readFileSync(new URL('./.env', import.meta.url), 'utf8')
      .match(/^VITE_ADMIN_WEB_APP_URL\s*=\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, '');
  } catch { /* Use environment configuration when no local .env exists. */ }
  const handler = adminHandler.createHandler(localUrl || env.VITE_ADMIN_WEB_APP_URL || env.APPS_SCRIPT_URL);
  const middleware = server => { server.middlewares.use('/api/admin', handler); };
  return {plugins:[tailwindcss(), {
    name:'local-admin-api', configureServer:middleware, configurePreviewServer:middleware,
  }]};
});
