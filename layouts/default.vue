<!-- STYLE -->
<style scoped>
li {
  cursor: pointer;
  list-style: none;
}

a {
  text-decoration: none;
}

a:visited {
  color: black;
}

main {
  min-height: 100vh;
  background-color: #202023;
  color: #ffffffd8;
}

.nav {
  background-color: #ffffffd8;
}
</style>

<!-- HTML -->
<template>
  <!-- AUTH PAGE -->
  <v-layout v-if="!authenticated" class="rounded rounded-md">
    <!-- MAIN CONTENT -->
    <v-main class="d-flex align-center justify-center">
      <slot />
    </v-main>
  </v-layout>

  <!-- MAIN APP -->
  <v-layout v-if="authenticated" class="rounded rounded-md">
    <!-- SIDE BAR -->
    <v-navigation-drawer>
      <div
        class="container d-flex flex-column justify-space-between px-3"
        style="min-height: 100%"
      >
        <v-list class="mt-2">
          <h3 class="mb-5" style="text-align: center; font-weight: lighter">
            Bills Management
          </h3>

          <li class="loginBtn d-flex mb-2 align-center">
            <span class="material-icons me-1" style="font-size: 18px"
              >create</span
            >
            <nuxt-link @click="showCreate">Create & Calculate</nuxt-link>
          </li>

          <li v-if="!isGuest" class="loginBtn d-flex align-center">
            <span class="material-icons me-1" style="font-size: 18px"
              >account_balance_wallet</span
            >
            <nuxt-link @click="showMyBills">My bills</nuxt-link>
          </li>
        </v-list>

        <!-- LOGIN / LOGOUT -->
        <v-list>
          <li
            v-if="authenticated"
            @click="logout"
            class="loginBtn d-flex align-center"
          >
            <span class="material-icons me-2">meeting_room</span>
            <nuxt-link>Logout</nuxt-link>
          </li>
        </v-list>
      </div>
    </v-navigation-drawer>

    <!-- MAIN CONTENT -->
    <v-main class="d-flex align-center justify-center">
      <slot />
    </v-main>
  </v-layout>
</template>

<!-- SCRIPT -->
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useViewStateStore } from '~/store/viewState';

const viewStateStore = useViewStateStore();
const router = useRouter();
const { showCreate, showMyBills } = viewStateStore;
const { logUserOut } = useAuthStore();
const { authenticated, isGuest } = storeToRefs(useAuthStore());
const { showCreateBills } = storeToRefs(useViewStateStore());

// IMPORTING ICONS FROM CDN
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    },
  ],
});

const logout = () => {
  logUserOut();
  showCreateBills.value = true;
  router.push('/login');
};

const checkGuest = () => {
  const token = useCookie('token');
  const tokenName = token.value;

  if (token && tokenName == 'guest') {
    isGuest.value = true;
  } else {
    isGuest.value = false;
  }
};

checkGuest();
</script>
