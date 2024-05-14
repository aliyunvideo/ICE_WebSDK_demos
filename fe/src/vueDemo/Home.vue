<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed"   :style="{height: '100vh', background: '#1a1d21'}" collapsible>
      <div :style="{color: '#fff', fontSize: '18px', textAlign: 'center'}" >
           <template v-if="!collapsed" >
            <span  ><cloud-outlined style="margin-right: 10px;" />云剪辑demo</span>
           </template>
           <template v-else >
            <cloud-outlined />
           </template>

        </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline"  :style="{background: '#1a1d21'}" @select="onSelect" >
        <a-menu-item key='projects'   >
          <copy-outlined />
          <span>工程列表</span>
        </a-menu-item>
        <a-menu-item key="templates">
          <diff-outlined />
          <span>模板列表</span>
        </a-menu-item>

      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup >
import { ref ,onMounted} from 'vue';
import {
  CopyOutlined,
  DiffOutlined,
  CloudOutlined,
} from '@ant-design/icons-vue';
import { useRouter,useRoute }  from 'vue-router';
const route = useRoute();
const pathname = route.path;
const pathKey =  pathname &&pathname.replace('/home', '');
const defaultKey = pathname && pathKey ? pathKey.replace('/','') : 'projects';
const selectedKeys = ref<string[]>([defaultKey]);
const collapsed = ref<boolean>(false);
const router = useRouter();
const onSelect = (menuItem)=>{
   router.push(`/home/${menuItem.key}`)
}
onMounted(()=>{

});
</script>