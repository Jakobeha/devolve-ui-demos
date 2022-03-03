#! /usr/bin/env node
// noinspection NodeCoreCodingAssistance

// region Boilerplate
const esbuild = require('esbuild')
const builtinModules = require('builtin-modules')

const entryPoints = [
  './src/wordle.js'
]

const nodeModules = builtinModules.flatMap(moduleName => [moduleName, `node:${moduleName}`])

// Shared node.js / browser build
esbuild.build({
  entryPoints,
  sourcemap: true,
  bundle: true,
  minify: false,
  format: 'esm',
  target: 'esnext',
  platform: 'neutral',
  mainFields: ['module', 'main'],
  outdir: 'out/app',
  define: {
    'import.meta.url': 'import_meta_url'
  },
  inject: ['src/polyfills.js'],
  watch: process.argv.includes('--watch'),
  external: nodeModules
}).catch(err => {
  console.error('build failed', err)
})
