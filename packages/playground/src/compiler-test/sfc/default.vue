<template>
  <div>
    <div>{{ message }}</div>
    <div>message</div>
    <Name
      name="Tom"
      :message="message"
      @click="handleClick"
    />
  </div>
</template>

<script>
import Name from './components/name.vue'

export default {
  components: {
    Name,
  },
  data() {
    return {
      message: 'Hello, Vue!'
    }
  },
  methods: {
    handleClick () {
      console.log(this.message)
    },
  },
}
</script>

<style scoped>
div {
  color: red;
}
</style>
