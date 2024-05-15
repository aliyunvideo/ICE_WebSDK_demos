<template>
    <div :class="`item ${selected ? 'selected' : ''}`" @click="emit('click')">
      <div class='cover' :style="{backgroundImage: `url(${coverUrl})`}" ></div>

        <template v-if="mediaType!=='image'" >
          <div class='duration'>{{ durationFormat }}</div>
        </template>


      <div className='title'>{{title}}</div>
    </div>
</template>

<script lang="ts" setup >
import { formatTime } from '../utils';

const {item,selected} = defineProps(["item", "selected"]);
const emit = defineEmits(['click']);
const mediaType = item.MediaBasicInfo.MediaType
let coverUrl
let title
let duration

if (mediaType === 'image') {
  coverUrl = item.FileInfoList[0].FileBasicInfo.FileUrl
  title = item.FileInfoList[0].FileBasicInfo.FileName
} else {
  coverUrl = item.MediaBasicInfo.CoverURL || 'https://img.alicdn.com/imgextra/i2/O1CN01fRTy3n1ZM1jvBOiyO_!!6000000003179-2-tps-240-136.png'
  title = item.FileInfoList[0].FileBasicInfo.FileName
  duration = item.FileInfoList[0].FileBasicInfo.Duration
}
const durationFormat = formatTime(duration);

</script>