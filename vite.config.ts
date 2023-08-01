import { defineConfig } from 'vite';
import { resolve } from 'path';
import uni from '@dcloudio/vite-plugin-uni';
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  // build: {
  //   minify: 'terser',
  //   terserOptions: {
  //     compress: {
  //       drop_console: false
  //     }
  //   }
  // },
  resolve: {
    alias: [
      {
        find: /\/@\//,
        replacement: pathResolve('src') + '/'
      }
    ]
  }
});
