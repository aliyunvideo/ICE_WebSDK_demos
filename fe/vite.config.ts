import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),vue(),
     Components({
    resolvers: [
      AntDesignVueResolver({
        importStyle: false, // css in js
      }),
    ],
  }),],
  server:{
    port:4001,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001',
      },
      '/openApiPost':{
        target: 'http://127.0.0.1:7001',
      },
      '/openApi':{
        target: 'http://127.0.0.1:7001',
      }
    },
  },
  build:{
    outDir:resolve(__dirname,'./build'),
    rollupOptions:{
       input:{
         index:resolve(__dirname,'index.html'),
         indexReact:resolve(__dirname,'index-react.html'),
         playerReact:resolve(__dirname,'player-react.html'),
         indexVue:resolve(__dirname,'index-vue.html')
       }
    }
  }
})
