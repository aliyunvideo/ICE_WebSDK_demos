<template>
  <a-modal
    open
    title="选择媒资导入"
    @ok="handleSubmit"
    @cancel="emit('close')"
    :width="720"
    :ok-button-props="{ disabled: selectedMedia.length === 0 }"
    ok-text="导入"
    cancel-text="取消"
    :confirm-loading="confirmLoading"
  >
    <a-radio-group
      style="margin-bottom: 20px"
      :options=" options "
      @change="handleMediaTypeChange "
      :value=" mediaType "
      option-type="button"
      button-style="solid"
    />
    <template v-if="status === 'done' && media.length > 0">
      <div style="display: flex; flex-wrap: wrap">
        <template v-for="item in media" :key="item.MediaId">
          <MediaItem
            @click="handleClick(item)"
            :selected="selectedMediaIds.indexOf(item.MediaId) > -1"
            :item="item"
          />
        </template>
      </div>
    </template>
    <template v-else-if="status === 'done'">
      <div style="height: 615px; text-align: center">暂无数据</div>
    </template>
    <template v-if="status === 'loading'">
      <div style="height: 615px; text-align: center">加载中...</div>
    </template>
    <template v-if="status === 'error'">
      <div style="color: red; height: 615px; text-align: center">加载出错</div>
    </template>
    <a-pagination
      style="text-align: center"
      :default-page-size="PAGE_SIZE"
      :current="page"
      :total="total"
      :showSizeChanger="false"
      @change="setPage"
    />
  </a-modal>
</template>
<script lang="ts" setup>
import {request,transMediaList} from '../utils';
import { onMounted, ref ,watch} from "vue";
import MediaItem from "./MediaItem.vue";

const options = [
  { label: "全部", value: "all" },
  { label: "视频", value: "video" },
  { label: "音频", value: "audio" },
  { label: "图片", value: "image" },
];
const PAGE_SIZE = 20;


const emit = defineEmits(['submit','close'])

const selectedMedia = ref<any[]>([]);
const confirmLoading = ref(false);
const mediaType = ref(options[0].value);
const status = ref("loading");
const page = ref(1);
const total = ref(0);
const media = ref<any[]>([]);
const selectedMediaIds = ref<string[]>([]);
const handleSubmit = async () => {

    const result = transMediaList( selectedMedia.value)
   emit('submit',result);
};
const handleMediaTypeChange = (e) => {
  mediaType.value = e.target.value;
  page.value = 1;
};
const handleClick = (item) => {

  const index = selectedMedia.value.findIndex(m => m.MediaId === item.MediaId)
    if (index > -1) {
      selectedMedia.value =  selectedMedia.value.filter((_, i) => i !== index)
    } else {
      selectedMedia.value =  selectedMedia.value.concat(item);
    }
};

const setPage = (p: number) => {
  page.value = p;
};

const fetchList = ()=>{
  status.value = 'loading';
    request('ListMediaBasicInfos', { // https://help.aliyun.com/document_detail/197964.html
      PageSize: PAGE_SIZE,
      PageNo: page.value,
      MediaType: mediaType.value, // 可填写 all, video, audio, image
      IncludeFileBasicInfo: true,
      Status: 'Normal'
    }).then(res => {
      status.value = 'done';
       media.value = res.data.MediaInfos;
       total.value = res.data.TotalCount;
    }).catch(() => {
      status.value = 'error';
      total.value = 0;

    })
}

watch(selectedMedia,(data)=>{
  selectedMediaIds.value = data.map((m) => m.MediaId);
})

watch([page,mediaType],()=>{
  fetchList();
});



onMounted(()=>{
  fetchList();
})

</script>
