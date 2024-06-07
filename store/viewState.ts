import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useViewStateStore = defineStore('viewState', () => {
  const showCreateBills = ref(true);

  const showCreate = () => {
    showCreateBills.value = true;
  };

  const showMyBills = () => {
    showCreateBills.value = false;
  };

  return {
    showCreateBills,
    showCreate,
    showMyBills,
  };
});
