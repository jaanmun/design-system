import esbuild from 'esbuild';
import pkg from './package.json' assert { type: 'json' };

const dev = process.argv.includes('--dev');
const minify = !dev;

const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies,
});

const baseConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify,
  sourcemap: true,
  outdir: 'dist',
  target: 'es2023',
  external,
};

Promise.all([
  esbuild.build({
    ...baseConfig,
    format: 'esm',
  }),
  esbuild.build({
    ...baseConfig,
    format: 'cjs',
    outExtension: { '.js': '.cjs' },
  }),
]).catch(() => {
  console.error('Build failed');
  process.exit(1);
});
