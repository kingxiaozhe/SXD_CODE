import * as path from 'path';
import { defineConfig, loadEnv, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd();

  const env = loadEnv(mode, root);
  const { VITE_APP_PORT, VITE_APP_MOCK, VITE_SERVICE_DOMAIN, VITE_SERVICE_PORT, VITE_WX_DOMAIN } = env;

  const isBuild = command === 'build';

  // vite 插件
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    react(),
    // vite-plugin-svg-icons
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(__dirname, './src/assets/iconsvg')],
      // Specify symbolId format
      symbolId: 'icon-[name]',
    }),
  ];
  // vite-plugin-mock
  if (VITE_APP_MOCK === 'true') {
    vitePlugins.push(
      viteMockServe({
        mockPath: 'mock',
        supportTs: true,
        watchFiles: true,
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        logger: true,
      }),
    );
  }

  return {
    root,
    server: {
      host: true,
      port: Number(VITE_APP_PORT || 3000),
      proxy: {
        '/api/consumePackage': {
          // 用于开发环境下的转发请求http://192.168.43.59:8090/api/consumePackage/list
          // 更多请参考：https://vitejs.dev/config/#server-proxy
          // target: 'http://192.168.43.59:8090',
          target: `${VITE_SERVICE_DOMAIN}:${VITE_SERVICE_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/data/, '/api'),
        },
        '/api/consumeOrder': {
          // 用于开发环境下的转发请求http://192.168.43.59:8090/api/consumePackage/list
          // 更多请参考：https://vitejs.dev/config/#server-proxy
          // target: 'http://192.168.43.59:8090',
          target: `${VITE_SERVICE_DOMAIN}:${VITE_SERVICE_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/data/, '/api'),
        },
        '/api/dictInfo': {
          // 用于开发环境下的转发请求http://192.168.43.59:8090/api/consumePackage/list
          // 更多请参考：https://vitejs.dev/config/#server-proxy
          // target: 'http://192.168.43.59:8090',
          target: `${VITE_SERVICE_DOMAIN}:${VITE_SERVICE_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/data/, '/api'),
        },
        '/api/cgi-bin': {
          target: `${VITE_WX_DOMAIN}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api/wxa': {
          target: `${VITE_WX_DOMAIN}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: `${path.resolve(__dirname, './node_modules')}/`,
        },
        {
          find: /@\//,
          replacement: `${path.resolve(__dirname, './src')}/`,
        },
      ],
    },
    plugins: vitePlugins,
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  };
});
