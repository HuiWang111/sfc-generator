<template>
  <div>
    {{ name }}
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
    },
    message: {
      type: String,
    },
  },
}
</script>

<style scoped>

</style>