<template>
  <a v-for="i in routes" @click="toPage(i)">{{ i.name }}</a>
  <div v-if="errorCode">{{ errorMessage }}</div>
  <router-view v-else v-slot="{ Component }">
    <keep-alive v-if="!isBrowser">
      <suspense timeout="0">
        <template #default>
          <component :is="Component" />
        </template>
        <template #fallback>
          <div>Loading</div>
        </template>
      </suspense>
    </keep-alive>
    <suspense timeout="0" v-else>
      <template #default>
        <component :is="Component" />
      </template>
      <template #fallback>
        <div>Loading</div>
      </template>
    </suspense>
  </router-view>
</template>

<script>
import { toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useRootStore } from "./store/root";

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const rootStore = useRootStore();
    const { errorCode, errorMessage, prefetching } = toRefs(rootStore);
    return {
      errorCode,
      errorMessage,
      prefetching,
      isBrowser: __isBrowser__,
      routes: [
        { name: 'index' },
        { name: 'counter' }
      ],
      toPage(i) {
        router.push({
          name: i.name
        });
      }
    }
  }
}
</script>
