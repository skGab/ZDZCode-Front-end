<!-- LIST OF USER BILLS -->
<template>
  <v-table style="padding: 0.5rem 0.5rem" fixed-header>
    <thead>
      <tr>
        <th class="text-left" style="min-width: 400px">Name</th>
        <th class="text-left">Value</th>
        <th class="text-left">Bill expire</th>
        <!-- Add Actions column -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in desserts" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.value }}</td>
        <td>{{ formatDate(item.date) }}</td>
        <td>
          <button class="me-5" @click="deleteBill(item.id)">Delete</button>
          <!-- Delete button -->
          <button @click="editBill(index)">Update</button>
          <!-- Edit button -->
        </td>
      </tr>
    </tbody>
  </v-table>

  <!-- Modal for editing a bill -->
  <v-dialog v-model="editModal" max-width="600">
    <template v-slot:activator="{ on }">
      <!-- Hidden button to activate the modal -->
      <button style="display: none" v-on="on">Open Modal</button>
    </template>

    <v-card>
      <v-card-title>Edit Bill</v-card-title>
      <v-card-text>
        <v-text-field v-model="editedBill.name" label="Name"></v-text-field>
        <v-text-field v-model="editedBill.value" label="Value"></v-text-field>
        <!-- Add more fields for editing other properties as needed -->
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="updateBill">Update</v-btn>
        <v-btn @click="editModal = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<!-- SCRIPT -->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';

const { authenticated, isGuest } = storeToRefs(useAuthStore());
const desserts = ref<BillDto[]>([]);

const editModal = ref(false);
const editedBill = ref<BillDto | null>(null);

interface BillDto {
  id: string;
  name: string;
  value: string;
  date: string;
  userEmail: string;
}

interface BillsPayload {
  bills: BillDto[];
  message: string;
}

const fetchUserBills = async () => {
  try {
    const token = useCookie('token');
    const userEmail = token.value;

    const response = await useFetch<BillsPayload>(
      `https://localhost:7218/bills/${userEmail}`
    );

    if (response.data.value?.bills) {
      desserts.value = response.data.value.bills;
    } else {
      console.error('Failed to fetch bills:', response);
    }
  } catch (error) {
    console.error('Error fetching bills:', error);
  }
};

// DELETE BILL
const deleteBill = async (id: any) => {
  try {
    const response = await useFetch<BillsPayload>(
      `https://localhost:7218/bills/delete/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (response.data.value) {
      desserts.value = desserts.value.filter((bill) => bill.id !== id);
    } else {
      console.error('Failed to fetch bills:', response);
    }
  } catch (error) {
    console.error('Error fetching bills:', error);
  }
};

// EDIT BILL
const editBill = (index: number) => {
  // Open the modal for editing the bill
  editModal.value = true;
  // Assign the bill data to be edited
  editedBill.value = { ...desserts.value[index] };
};

// UPDATE BILL
const updateBill = async () => {
  if (!editedBill.value) return;

  try {
    const response = await useFetch<boolean>(
      `https://localhost:7218/bills/update/${editedBill.value.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(editedBill.value),
      }
    );

    if (response.data.value) {
      // Update the desserts array with the updated bill data
      desserts.value = desserts.value.map((bill) =>
        bill.id === editedBill.value!.id ? editedBill.value! : bill
      );
      // Close the modal after successful update
      editModal.value = false;
    } else {
      console.error('Failed to update bill:', response);
    }
  } catch (error) {
    console.error('Error updating bill:', error);
  }
};

// FORMAT DATE
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

// CALL FETCH BILLS ONLY IF IS NOT A GUEST USER
if (authenticated.value && !isGuest.value) fetchUserBills();
</script>
