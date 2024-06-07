<template>
  <div class="d-flex align-center" style="text-align: left">
    <!-- TITLE -->
    <h1 style="font-weight: lighter; font-size: 2.5rem" class="me-10">
      Bills <br />
      Managment
    </h1>

    <!-- FORM -->
    <form
      @submit.prevent="isCreateMode ? createAccount() : login()"
      class="d-flex flex-column"
      style="min-width: 300px"
    >
      <h2 style="text-align: center">
        {{ isCreateMode ? 'Create Account' : 'Member Login' }}
      </h2>
      <p class="mb-5 text-center" style="font-size: 0.8rem">
        {{
          isCreateMode
            ? 'Fill in the information to create your account'
            : 'Put your information or just start using'
        }}
      </p>

      <!-- NAME -->
      <v-text-field
        v-model="state.email"
        :error-messages="v$.email.$errors.map((e) => e.$message)"
        label="email@domain.com"
        required
        @blur="v$.email.$touch"
        @input="v$.email.$touch"
      ></v-text-field>

      <!-- PASSWORD -->
      <v-text-field
        v-model="state.password"
        :counter="10"
        :error-messages="v$.password.$errors.map((e) => e.$message)"
        label="password"
        required
        solo
        @blur="v$.password.$touch"
        @input="v$.password.$touch"
      ></v-text-field>

      <!-- BUTTONS -->
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-top: 1rem;
        "
      >
        <!-- LOGIN BUTTON -->
        <v-btn
          v-if="!isCreateMode"
          style="font-size: 0.7rem"
          color="#1B1B1B"
          @click="login"
        >
          Login
        </v-btn>

        <!-- CREATE BUTTON -->
        <v-btn
          v-if="isCreateMode"
          style="font-size: 0.7rem"
          color="#1B1B1B"
          @click="createAccount"
        >
          Create Account
        </v-btn>

        <!-- GUEST -->
        <v-btn
          style="font-size: 0.7rem"
          color="#1B1B1B"
          class="my-4"
          @click="withoutLogin"
          >Acess as guest</v-btn
        >
      </div>

      <!-- REQUEST ERRROR RESPONSE -->
      <v-alert
        v-if="loginError"
        type="error"
        class="mt-4"
        style="padding: 0.5rem"
      >
        {{ loginError }}
      </v-alert>

      <!-- TOGGLE MODE BUTTON -->
      <v-btn
        style="box-shadow: none; font-size: 0.7rem; background: none"
        @click="isCreateMode = !isCreateMode"
      >
        {{ isCreateMode ? 'Back to Login' : 'Create your Account' }}
      </v-btn>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { reactive } from 'vue';

const { authenticateUser, authenticateAsGuest, createUser } = useAuthStore();
const { authenticated } = storeToRefs(useAuthStore());
const router = useRouter();
const loginError = ref('');
const isCreateMode = ref(false);

// STORE STRUCTURE
const initialState = {
  email: '',
  password: '',
};

const state = reactive({
  ...initialState,
});

// VALIDATION
const rules = {
  email: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, state);

// LOGIN HANDLE
const login = async () => {
  const isFormValid = await v$.value.$validate();

  if (isFormValid) {
    await authenticateUser(state);

    if (authenticated.value) {
      router.push('/dashboard');
    } else {
      loginError.value = 'Invalid e-mail or password';
    }
  }
};

// CREATE ACCOUNT HANDLE
const createAccount = async () => {
  const isFormValid = await v$.value.$validate();

  if (isFormValid) {
    await createUser(state);

    if (authenticated.value) {
      router.push('/dashboard');
    } else {
      loginError.value = 'Internal server error';
    }
  }
};

// WITHOUT LOGIN HANDLE
const withoutLogin = async () => {
  authenticateAsGuest();
  router.push('/dashboard');
};
</script>
