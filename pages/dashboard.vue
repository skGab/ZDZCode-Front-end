<template>
  <!-- CREATE OR ADD BILLS COMPONENT -->
  <CreateBills v-if="showCreateBills" />

  <!-- BILLS TABLE -->
  <MyBills v-if="!showCreateBills && !isGuest" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useViewStateStore } from '~/store/viewState';
import { useAuthStore } from '~/store/auth';

const { showCreateBills } = storeToRefs(useViewStateStore());
const { isGuest } = storeToRefs(useAuthStore());
</script>
