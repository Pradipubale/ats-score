import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createNodeMiddleware } from '@tanstack/react-start/node';

// The default export from dist/server/index.js is the server handler
import { default as handler } from './dist/server/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// 1. Serve static assets from dist/client
app.use(express.static(join(__dirname, 'dist/client')));

// 2. Handle SSR requests using TanStack Start handler
app.use(createNodeMiddleware(handler));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Frontend SSR Server running at http://localhost:${port}`);
});
