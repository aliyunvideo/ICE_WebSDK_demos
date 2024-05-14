<template>
  <a-card
  title='工程列表'

  >
   <template #extra >
    <div>
     <a-button type="primary"  @click="onModalOpen" >
      创建工程
     </a-button>
     </div>
   </template>
    <a-list item-layout="horizontal" :data-source="data.list">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta>
         <template  #title >
          <router-link  :to="`/home/detail/${item.ProjectId}`" > {{ item.Title }}</router-link>
         </template>
        </a-list-item-meta>
        <a-button :style="{marginLeft: '10px'}" @click="router.push(`/home/detail/${ item.ProjectId }`)" >编辑</a-button>
        <a-button :style="{marginLeft: '10px'}" @click="router.push(`/home/player/${ item.ProjectId }`)" >预览</a-button>
      </a-list-item>
    </template>
  </a-list>
  <a-pagination v-model:current="current" :total="data.total"   />
  </a-card>
 <a-modal v-model:open="openModal" title="创建剪辑工程" :confirmLoading="okLoading" @ok="onCreateProject" @cancel="onModalClose" >
  <a-form
          v-model="fromState"

          >
            <a-form-Item name='title' label='工程名称'  >
              <a-input v-model:value="fromState.title" />
            </a-form-Item>
          </a-form>
 </a-modal>

</template>

<script lang="ts" setup >
import {request} from '../utils';
import { onMounted ,reactive,ref, watch} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const data = reactive({
  list:[],
  total:0
});

let fromState = reactive({
   title:''
});

const current = ref(1);
const okLoading = ref(false);
const openModal = ref(false);

const fetchList = async ({pageNo,pageSize})=>{
  request('SearchEditingProject', {
      TemplateType: 'None',
      PageSize: pageSize,
      PageNo: pageNo
    }).then(res => {
      if (res.status === 200) {
        data.list =res.data.ProjectList;
        data.total = res.data.TotalCount;
      }
    })
}


const onModalOpen = ()=>{
  openModal.value = true;
}

const onModalClose = ()=>{
  openModal.value = false;
}

const onCreateProject = ( )=>{
  console.log('>>>>',fromState)
  okLoading.value = true;
  request('CreateEditingProject', {
      Title: fromState.title
    }).then(() => {
      okLoading.value = false;
      onModalClose();
      fetchList({pageNo: current.value,pageSize:10});
    })
}

onMounted(()=>{
  fetchList({pageNo:1,pageSize:10})
});

 watch(current,()=>{
  fetchList({pageNo:current.value,pageSize:10})
 });

</script>