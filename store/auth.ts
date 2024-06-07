// store/auth.ts

import { defineStore } from 'pinia';

interface UserData {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    isGuest: true,
  }),
  actions: {
    // LOGIN
    async authenticateUser({ email, password }: UserData) {
      try {
        const data = await $fetch('https://localhost:7218/user/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {
            email,
            password,
          },
        });

        if (data) {
          const token = useCookie('token'); // useCookie new hook in nuxt 3
          token.value = email; // set token to cookie
          this.isGuest = false;
          this.authenticated = true; // set authenticated  state value to true
        }
      } catch (error) {
        console.log(error);
        return (this.authenticated = false);
      }
    },

    // LOGIN
    async createUser({ email, password }: UserData) {
      try {
        const data = await $fetch('https://localhost:7218/user/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {
            email,
            password,
          },
        });

        if (data) {
          const token = useCookie('token'); // useCookie new hook in nuxt 3
          token.value = email; // set token to cookie
          this.isGuest = false;
          this.authenticated = true; // set authenticated  state value to true
        }
      } catch (error) {
        console.log(error);
        return (this.authenticated = false);
      }
    },

    // LOGGOUT
    logUserOut() {
      const token = useCookie('token'); // useCookie new hook in nuxt 3
      this.authenticated = false; // set authenticated  state value to false
      this.isGuest = false;
      token.value = null; // clear the token cookie
    },

    // LOGIN AS GUEST
    authenticateAsGuest() {
      const token = useCookie('token');
      token.value = 'guest'; // Set guest token
      this.authenticated = true;
      this.isGuest = true; // Set guest status
    },
  },
});
