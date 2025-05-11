<template>
  <n-selector style="width: 30px;">
    <span>124</span>
    <template #trigger="{ toggle }">
      <div id="portrait-more" style="cursor: pointer;width: 30px;height: 30px;" @click="toggle" v-html="moreIcon" />
    </template>
    <template #panel>
      <n-selector-item>
        <help label="帮助" :icon-size="26" :config-list="configList">
          <template #title>
            <div>自定义 title</div>
          </template>
        </help>
      </n-selector-item>
    </template>
  </n-selector>
</template>

<script>
export default {}
</script>
