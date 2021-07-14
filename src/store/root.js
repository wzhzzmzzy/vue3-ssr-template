import { defineStore } from 'pinia'

export const useRootStore = defineStore({
  id: '__root',
  state() {
    return {
      ssrInitial: false,
      errorCode: 0,
      errorMessage: '',
      prefetching: false
    }
  },
  actions: {
    toggleInitial(ssrInitial) {
      this.ssrInitial = ssrInitial
    },
    togglePrefetching(prefetching) {
      this.prefetching = prefetching;
    }
  }
})
