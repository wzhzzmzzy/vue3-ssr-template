import {defineStore} from 'pinia'

export const useMainStore = defineStore({
  id: 'main',
  state() {
    return {
      code: 'this is main store'
    }
  },
  actions: {
    async fetchSomething() {
      this.code = await new Promise(resolve => {
        setTimeout(() => {
          resolve('fetch new data');
        }, 1000);
      });
    }
  }
})
