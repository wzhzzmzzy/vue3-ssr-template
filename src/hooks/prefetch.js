import { onBeforeRouteLeave } from 'vue-router';
import { useRootStore } from '../store/root';

export function needDestory (useStores = []) {
  let useStoreArray = useStores;
  if (!Array.isArray(useStores) && useStores) {
    useStoreArray = [useStores];
  }
  const stores = useStoreArray.map(i => i());
  onBeforeRouteLeave(() => {
    stores.map(i => i.$reset());
  });
  if (!Array.isArray(useStores)) {
    return stores[0];
  }
  return stores;
}

export async function usePrefetch(fetchData) {
  const rootStore = useRootStore();
  if (__isBrowser__) {
    if (rootStore.ssrInitial) {
      // skip fetch
      rootStore.toggleInitial(false);
      return;
    }
    rootStore.togglePrefetching(true);
  }
  try {
    await fetchData({ rootStore });
  } catch (e) {
    rootStore.$patch({
      errorCode: e.code || 500,
      errorMessage: e.message || '系统异常'
    });
  } finally {
    __isBrowser__
      ? rootStore.togglePrefetching(false)
      : rootStore.toggleInitial(true)
  }
}

