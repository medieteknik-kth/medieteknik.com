const esbuild = require('esbuild')
const path = require('node:path')

const isProduction = process.env.NODE_ENV === 'production'

esbuild
  .build({
    entryPoints: [path.join(__dirname, '../src/sw/service-worker.ts')],
    outfile: path.join(__dirname, '../public/service-worker.js'),
    bundle: false,
    minify: isProduction,
    sourcemap: isProduction ? false : 'inline',
    format: 'iife',
    target: 'esnext',
    define: {
      'process.env.NODE_ENV':
        JSON.stringify(process.env.NODE_ENV) || JSON.stringify('production'),
    },
  })
  .then(() => {
    console.log(
      `✅ [${isProduction ? 'Production' : 'Development'}] Service worker built successfully!`
    )
  })
  .catch(() => {
    process.exit(1)
  })
