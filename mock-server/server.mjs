#!/bin/env/node

process.env.NITRO_PORT = 39000;

await import('./.output/server/index.mjs');
