import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    outDir:resolve(__dirname,'../nodejs/fe/build'),
    rollupOptions:{
       input:{
         index:resolve(__dirname,'index.html'),
         player:resolve(__dirname,'player.html'),
       }
    }
  }
})
