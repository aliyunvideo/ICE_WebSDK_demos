<template>
  <div
    ref="containerRef"
    :style="{
      width: '800px',
      height: '450px',
      margin: '30px auto',
      background: '#efefef',
    }"
  ></div>
  <div :style="{ width: '800px', margin: '30px auto' }">
    <a-input v-model:value="projectIdRef" placeholder="项目ID"></a-input>
    <a-button @click="reset">获取timeline</a-button>

  </div>
</template>

<script lang="ts" setup>
import { createProjectPlayer, parseTimeline } from "../playerUtil";
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { request } from "../utils";

const playerRef = ref();
const containerRef = ref<HTMLDivElement>();
const route = useRoute();
const projectIdRef = ref(route.params.projectId as string);

const fetchTimeline = async (projectId?: string) => {
  if (!projectId) {
    return {
      mediaMap: {},
      timeline: {},
    };
  }
  const res = await request("GetEditingProject", {
    // https://help.aliyun.com/document_detail/197837.html
    ProjectId: projectId,
    RequestSource:'WebSDK'
  });
  if (!res.data.Project.Timeline) {
    alert("Timeline数据为空");
    return;
  }
  const timeineInfo = JSON.parse(res.data.Project.Timeline);
  const outputInfo =timeineInfo.FECanvas? {
    outputWidth: Number(timeineInfo.FECanvas.Width),
    outputHeight: Number(timeineInfo.FECanvas.Height),
  }:{

  };
  const parsedData = parseTimeline(timeineInfo, outputInfo);
  return parsedData;
};

const createPlayer = async (container: HTMLDivElement, projectId?: string) => {
  const { mediaMap, timeline } = await fetchTimeline(projectId);

  playerRef.value = createProjectPlayer({
    container,
    minWidth: 520,
    controls: true,
    beforeMediaInfo: async (mediaId) => {
      if (!mediaMap) {
        return null;
      }
      if (mediaMap && mediaMap[mediaId] && mediaMap[mediaId].mediaUrl) {
        return mediaMap[mediaId].mediaUrl;
      }
      return null;
    },
  });
  playerRef.value.timeline = timeline;
};
const reset = async () => {
  const container = containerRef.value;
  if (!container) {
    return;
  }
  const { timeline } = await fetchTimeline(projectIdRef.value);
  playerRef.value.timeline = timeline;
};
onMounted(() => {
  const container = containerRef.value;
  if (!container) {
    return;
  }
  createPlayer(container, projectIdRef.value);

});

onUnmounted(() => {
  playerRef.value.destroy();
});
</script>
