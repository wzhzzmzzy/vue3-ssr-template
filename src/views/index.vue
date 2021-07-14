<template>
  <div>Just a Test Page</div>
  <p :class="[$style.red, $style.bold]">{{ text }}</p>
  <p>Pinia: {{ main.code }}</p>
  <a @click="toCounterPage">Counter</a>
</template>

<script>
import { ref } from 'vue';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useHead } from '@vueuse/head';
import { usePrefetch } from '../hooks/prefetch';
import { useMainStore } from '../store/main';

export default {
  name: 'TestPage',
  async setup() {
    const router = useRouter();
    const text = ref('This can be red by CSS Module');
    const toCounterPage = () => {
      router.push({ name: 'counter' });
    }
    const main = useMainStore();
    useHead({
      title: 'Test Pages'
    });
    onBeforeRouteUpdate((to, from) => {
      console.log('in component', to, from);
    });
    console.log(main.code);
    await usePrefetch(async () => {
      await main.fetchSomething();
    });
    console.log(main.code);
    return {
      text,
      main,
      toCounterPage
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
