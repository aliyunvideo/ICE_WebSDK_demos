import { createApp } from 'vue'
import App from './App.vue'

// 引入插件
import router from './router';


// 安装router插件
const app = createApp(App);
app.use(router);

app.mount('#app')