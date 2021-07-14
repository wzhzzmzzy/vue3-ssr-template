import { createPinia } from "pinia";

export let pinia = null;

export default function createStore () {
  pinia = createPinia();
  return pinia;
}
