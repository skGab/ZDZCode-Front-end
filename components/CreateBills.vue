<style lang="scss" scoped>
.bill-input {
  width: 100%;
}

h4 {
  letter-spacing: 0.05rem;
}

ul {
  padding: 0 1.5rem;
  li {
    font-size: 0.9rem;
  }
}
</style>

<template>
  <div class="container text-center">
    <h1 class="mb-4">Manage Bills</h1>
    <p class="mb-2">Add your bills and calculate the total expenses</p>

    <form @submit.prevent="" class="d-flex flex-column">
      <div class="d-flex align-center mb-1">
        <!-- NAME -->
        <v-text-field
          class="me-2 bill-input"
          v-model="bill.name"
          :error-messages="v$.name.$errors.map((e) => e.$message)"
          label="name"
          type="text"
          @blur="v$.name.$touch"
          @input="v$.name.$touch"
        ></v-text-field>

        <!-- AMOUNT -->
        <v-text-field
          class="me-5 bill-input"
          v-model="bill.amount"
          :error-messages="v$.amount.$errors.map((e) => e.$message)"
          label="value"
          type="number"
          @blur="v$.amount.$touch"
          @input="v$.amount.$touch"
        ></v-text-field>

        <!-- CREATE / ADD BUTTON -->
        <v-btn
          class="mb-4"
          style="font-size: 0.7rem"
          color="#1B1B1B"
          @click="addBill"
        >
          {{ buttonTitle }}
        </v-btn>
      </div>

      <div>
        <!-- CALCULATE BUTTON -->
        <v-btn
          class="me-2"
          width="40%"
          style="font-size: 0.7rem"
          color="#1B1B1B"
          @click="calculateTotal"
        >
          Calculate
        </v-btn>

        <!-- CLEAR HISTORY BUTTON (only for guests) -->
        <v-btn
          width="40%"
          color="#1B1B1B"
          style="font-size: 0.7rem"
          @click="clearHistory"
        >
          Clear History
        </v-btn>
      </div>

      <!-- Bills history for calculation -->
      <div class="mt-10 text-left">
        <div v-if="bills.length > 0">
          <h4>History</h4>
          <ul class="mt-2">
            <li v-for="(bill, index) in bills" :key="index">
              {{ bill.name }}: ${{ bill.amount }}
            </li>
          </ul>
        </div>

        <!-- TOTAL AMOUNT -->
        <div v-if="totalAmount !== null" class="mt-3">
          <h4>Total expenses: ${{ totalAmount }}</h4>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { required, minValue } from '@vuelidate/validators';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { reactive, ref, computed } from 'vue';

// CREATE STRUCTURES
const { authenticated, isGuest } = storeToRefs(useAuthStore());
const router = useRouter();

const bill = reactive({
  name: '',
  amount: null,
});

const bills = ref<(typeof bill)[]>([]);
const totalAmount = ref<number | null>(null);

const rules = {
  name: { required },
  amount: { required, minValue: minValue(1) },
};

const v$ = useVuelidate(rules, bill);

// CREATE OR ADD BILLS
const addBill = async () => {
  const isFormValid = await v$.value.$validate();

  if (isFormValid) {
    if (authenticated.value && !isGuest.value) {
      try {
        const token = useCookie('token');
        const userEmail = token.value;

        const response = await $fetch('https://localhost:7218/bills/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {
            name: bill.name,
            value: String(bill.amount),
            userEmail: userEmail,
          },
        });

        bills.value.push({ ...bill });
      } catch (error) {
        console.error('Error storing the bill:', error);
        alert('Failed to store the bill. Please try again.');
      }
    } else {
      bills.value.push({ ...bill });
    }
    bill.name = '';
    bill.amount = null;
    v$.value.$reset();
  }
};

// CALCULATE TOTAL
const calculateTotal = () => {
  if (bills.value.length > 1) {
    totalAmount.value = bills.value.reduce(
      (sum, bill) => sum + Number(bill.amount),
      0
    );
  } else {
    totalAmount.value = null;
    alert('Please add at least two bills to calculate the total.');
  }
};

// CLEAR HISTORY ONLY FOR GUESTS
const clearHistory = () => {
  bills.value = [];
  totalAmount.value = null;
};

// DINAMIC BUTTON
const buttonTitle = computed(() => {
  if (authenticated.value && isGuest.value) {
    return 'Add';
  } else if (authenticated.value && !isGuest.value) {
    return 'Create';
  }
});
</script>
