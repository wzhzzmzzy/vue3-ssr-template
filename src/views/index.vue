<template>
  <div>Just a Test Page</div>
  <p :class="[$style.red, $style.bold]">{{ text }}</p>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'TestPage',
  setup() {
    const text = ref('This can be red by CSS Module');
    return {
      text
    }
  }
}
</script>

<style module>
.red {
  color: red;
}
.bold {
  font-weight: bold;
}
</style>
