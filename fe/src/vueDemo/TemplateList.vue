<template>
  <a-card
  title='工程列表'

  >

    <a-list item-layout="horizontal" :data-source="data.list"  v-model:loading="loading" >
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta>
         <template  #title >
          <router-link  :to="`/home/template/${item.TemplateId}`" > {{ item.Name }}</router-link>
         </template>
        </a-list-item-meta>
        <a-button :style="{marginLeft: '10px'}" @click="router.push(`/home/template/${ item.TemplateId }`)" >编辑</a-button>
      </a-list-item>
    </template>
  </a-list>
  <a-pagination v-model:current="current" :total="data.total"   />
  </a-card>


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



const current = ref(1);


const loading = ref(false);

const fetchList = async ({pageNo,pageSize})=>{
  loading.value = true;
  request('ListTemplates', {
       Type: 'Timeline',
      PageSize: pageSize,
      PageNo: pageNo
    }).then(res => {
      if (res.status === 200) {
        data.list =res.data.Templates;
        data.total = res.data.TotalCount;
      }
    }).finally(()=>{
      loading.value =false;
    })
}





onMounted(()=>{
  fetchList({pageNo:1,pageSize:10})
});

 watch(current,()=>{
  fetchList({pageNo:current.value,pageSize:10})
 });

</script>