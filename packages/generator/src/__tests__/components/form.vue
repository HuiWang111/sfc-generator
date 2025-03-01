<template>
  <form-creator-config-provider :locale="locale">
    <div class="container">
      <div class="submit-container">
        <a-button type="primary" @click="handleSubmit" class="submit-btn">{{$t('saveBtn')}}</a-button>
      </div>
      <div
        v-if="a"
        v-show="b"
        v-for="data of formCreateData" 
        :key="data.key"
        class="form-item"
        @click="handleSubmit"
      >
        <h2>{{ data.title }}</h2>
        <form-create
          v-model="formApis[data.key]"
          :rule="data.formItems"
          :option="options"
        />
      </div>
    </div>
  </form-creator-config-provider>
</template>

<script>
export default {}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>

<style>
.submit-container {
  width: 100%;
  height: 100%;
}
</style>
