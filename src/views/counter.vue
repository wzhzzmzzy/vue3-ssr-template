<template>
  <p>count</p>
  <button @click="add">{{ count }}</button>
</template>

<script>
import { ref } from 'vue';
import { useHead } from '@vueuse/head';

export default {
  name: 'Counter',
  setup() {
    const count = ref(1);
    useHead({
      title: 'Counter'
    })
    return {
      count,
      add() { count.value += 1 }
    }
  }
}
</script>
