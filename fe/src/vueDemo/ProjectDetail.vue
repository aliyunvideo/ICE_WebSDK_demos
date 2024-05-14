<template>
  <div id="app" ref="containerRef" style="height: 100vh"></div>
  <template v-if="searchMediaShowRef">
    <SearchMediaModal
      :project-id="projectIdRef"
      @submit="onSearchMediaSubmit"
      @close="onSearchMediaClose"
    />
  </template>
  <template v-if="produceVideoShowRef">
    <ProduceVideoModal
      :aspect-ratio="produceVideoRef.aspectRatio"
      :recommend="produceVideoRef.recommend"
      @submit="onProduceVideoSubmit"
      @close="onProduceVideoClose"
    />
  </template>
  <contextHolder />
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { createEditor } from "../editorUtil";
import { request } from "../utils";
import SearchMediaModal from "./SearchMediaModal.vue";
import ProduceVideoModal from "./ProduceVideoModal.vue";
import { message } from "ant-design-vue";

const [messageApi, contextHolder] = message.useMessage();

const containerRef = ref<HTMLDivElement | null>(null);
const editorRef = ref<{ destroy: () => void } | null>(null);
const route = useRoute();
const projectIdRef = ref(route.params.projectId as string);
const templateIdRef = ref(route.params.templateId as string);
const searchMediaRef = ref({ resolve: (v: any) => {} });
const searchMediaShowRef = ref(false);
const produceVideoRef = ref<{
  timeline: any;
  aspectRatio?: any;
  recommend?: any;
  resolve: () => void;
}>({ resolve: () => {}, timeline: {} });
const produceVideoShowRef = ref(false);
const myLocale = "zh-CN";

watch(
  () => route.params.projectId,
  (value) => {
    if (typeof value === "string") {
      projectIdRef.value = value;
    } else {
      projectIdRef.value = value[0];
    }
  }
);
const onSearchMediaSubmit = (res) => {
  searchMediaRef.value.resolve(res);
  searchMediaShowRef.value = false;
};
const onSearchMediaClose = () => {
  searchMediaShowRef.value = false;
};

const onProduceVideoSubmit = async ({
  fileName,
  format,
  bitrate,
  resolution,
  ossBucket,
}) => {
  // 先根据 fileName 和 format 拼接出存储的 mediaURL

  let mediaURL;
  let OutputMediaTarget = "oss-object";
  let StorageLocation;
  let FileName;
  if (ossBucket.indexOf("vod://") === 0) {
    OutputMediaTarget = "vod-media";
    StorageLocation = ossBucket.replace("vod://", "");
    FileName = `${fileName}.${format}`;
  } else {
    mediaURL = `${ossBucket}${fileName}.${format}`;
  }

  const [width, height] = resolution;
  try {
    await request("SubmitMediaProducingJob", {
      // https://help.aliyun.com/document_detail/197853.html
      OutputMediaConfig: JSON.stringify({
        mediaURL,
        bitrate,
        width,
        height,
        StorageLocation,
        FileName,
      }),
      OutputMediaTarget,
      ProjectId: projectIdRef.value,
      Timeline: JSON.stringify(produceVideoRef.value.timeline),
    });
    message.success("生成视频成功");
    produceVideoShowRef.value = false;
    produceVideoRef.value.resolve();
  } catch (ex) {
    message.success("生成视频失败");
    produceVideoShowRef.value = false;
    produceVideoRef.value.resolve();
  }
  produceVideoRef.value.resolve();
  produceVideoShowRef.value = false;
};
const onProduceVideoClose = () => {
  produceVideoShowRef.value = false;
};
onMounted(() => {
  if (!containerRef.value || (!projectIdRef.value && !templateIdRef.value)) {
    return;
  }
  const editor = createEditor({
    container: containerRef.value,
    projectId: projectIdRef.value,
    templateId: templateIdRef.value,
    locale: myLocale,
    mode: templateIdRef.value ?'template':'project',
    onSearchMedia: async () => {
      searchMediaShowRef.value = true;
      return new Promise<any>((resolve) => {
        searchMediaRef.value = { resolve: resolve };
      });
    },
    onProduceEditingProjectVideo: async ({
      coverUrl,
      duration = 0,
      aspectRatio,
      timeline,
      recommend,
    }) => {
      produceVideoShowRef.value = true;
      return new Promise<void>((resolve) => {
        produceVideoRef.value = {
          resolve: resolve,
          timeline,
          aspectRatio,
          recommend,
        };
      });
    },
    message:messageApi,
  });
  editor.init();
  editorRef.value = editor;
});

onUnmounted(() => {
  if (editorRef.value) {
    editorRef.value.destroy();
  }
});
</script>
