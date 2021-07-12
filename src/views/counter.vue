<template>
  <p>count</p>
  <button @click="add">{{ count }}</button>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Counter',
  setup() {
    const count = ref(1);
    return {
      count,
      add() { count.value += 1 }
    }
  }
}
</script>
