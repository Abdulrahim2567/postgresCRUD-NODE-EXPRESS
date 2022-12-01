<template>
  <div class="container pt-5">
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button
            label="Delete"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedProducts || !selectedProducts.length"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="products"
        v-model:selection="selectedProducts"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        responsiveLayout="scroll"
      >
        <template #header>
          <div class="table-header">
            <h5 class="mb-2 md:m-0 p-as-md-center">LIST TRAVEL TICKETS</h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </span>
          </div>
        </template>

        <Column selectionMode="multiple" :exportable="false"></Column>
        <colgroup>
          <Column field="passenger_name" header="Passenger Name" :sortable="true"></Column>
          <Column field="itinerary" header = "Itinerary" :sortable="true"></Column>
          <Column field="ticket_number" header="Airline Number" :sortable="true"></Column>
          <Column field="currency" header="Currency" :sortable="true"></Column>
          <Column field="amount" header="Amount" :sortable="true"></Column>
          <Column field="days" header="Days" :sortable="true"></Column>
          <Column field="flight_status" header="Flight Status" :sortable="true"></Column>
        </colgroup>
        
        <Column :exportable="false">
          <template #body="slotProps">


            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="editProduct(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Passenger Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Passenger Name</label>
        <InputText
          id="name"
          v-model.trim="product.passenger_name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.passenger_name }"
        />
        <small class="p-error" v-if="submitted && !product.passenger_name"
          >Name is required.</small
        >
      </div>
      
      <div class="field">
        <label for="name">Issuing Date</label>
        <Input
          type="date"
          v-model.trim="product.issuing_date"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.issuing_date }"
          class="form-control"
        />
        <small class="p-error" v-if="submitted && !product.issuing_date"
          >Issuing Date is required.</small
        >
      </div>
      <div class="field">
        <label for="name">Itinerary</label>
        <select
              class="form-select"
              required
              aria-label="Default select example"
              v-model.trim="product.travel_type"
              id="name"
              :class="{ 'p-invalid': submitted && !product.itinerary }"
            >
              <option selected disabled value="">Choose...</option>
              <option value="Flight">Flight</option>
              <option value="Boat">Boat</option>
              <option value="Train">Train</option>
              <option value="Car">Car</option>
            </select>
        <small class="p-error" v-if="submitted && !product.itinerary"
          >Itinerary is required.</small
        >
      </div>
      <div class="field">
        <label for="name">Travel Type</label>
        <InputText
          id="name"
          v-model.trim="product.itinerary"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.itinerary }"
        />
        <small class="p-error" v-if="submitted && !product.itinerary"
          >Itinerary is required.</small
        >
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label for="price">Amount</label>
          <InputNumber
            id="price"
            v-model="product.amount"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveProduct"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure you want to delete <b>{{ product.passenger_name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="Non"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductDialog = false"
        />
        <Button
          label="Oui"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteProduct"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure you want to delete the selected products?</span
        >
      </div>
      <template #footer>
        <Button
          label="Non"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductsDialog = false"
        />
        <Button
          label="Oui"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import ProductService from "./service/productService";
import axios from "axios";

export default {
  name: "dataTablesVue",
  setup() {
    onMounted(() => {
      //productService.value
        //.getProducts()
        //.then((data) => (products.value = data));
      axios.get('http://localhost:3000/api/v1/records').then((res) => {
        
        products.value = res.data.record
        console.log(products.value);
        return products.value
        
      }).catch(() =>{} )
    });

    const toast = useToast();
    const dt = ref();
    const products = ref();
    const productDialog = ref(false);
    const deleteProductDialog = ref(false);
    const deleteProductsDialog = ref(false);
    const product = ref({});
    const productService = ref(new ProductService());
    const selectedProducts = ref();
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const submitted = ref(false);
    const statuses = ref([
      { label: "INSTOCK", value: "instock" },
      { label: "LOWSTOCK", value: "lowstock" },
      { label: "OUTOFSTOCK", value: "outofstock" },
    ]);

    const formatCurrency = (value) => {
      if (value)
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      return;
    };
    const openNew = () => {
      product.value = {};
      submitted.value = false;
      productDialog.value = true;
    };
    const hideDialog = () => {
      productDialog.value = false;
      submitted.value = false;
    };
    const saveProduct = () => {
      submitted.value = true;

      if (product.value.name.trim()) {
        if (product.value.id) {
          product.value.inventoryStatus = product.value.inventoryStatus.value
            ? product.value.inventoryStatus.value
            : product.value.inventoryStatus;
          products.value[findIndexById(product.value.id)] = product.value;
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product Updated",
            life: 3000,
          });
        } else {
          product.value.inventoryStatus = product.value.inventoryStatus
            ? product.value.inventoryStatus.value
            : "INSTOCK";
          products.value.push(product.value);
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Product Created",
            life: 3000,
          });
        }

        productDialog.value = false;
        product.value = {};
      }
    };
    const editProduct = (prod) => {
      product.value = { ...prod };
      productDialog.value = true;
    };
    const confirmDeleteProduct = (prod) => {
      product.value = prod;
      deleteProductDialog.value = true;
    };
    const deleteProduct = () => {
        //axios.delete('api',product.value.id).then().catch()
      products.value = products.value.filter(
        (val) => val.id !== product.value.id
      );
      deleteProductDialog.value = false;
      product.value = {};
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000,
      });
    };
    const findIndexById = (id) => {
      let index = -1;
      for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
          index = i;
          break;
        }
      }

      return index;
    };
    const createId = () => {
      let id = "";
      var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    };
    const confirmDeleteSelected = () => {
      deleteProductsDialog.value = true;
    };
    const deleteSelectedProducts = () => {
        
      axios.delete(`api/v1/record/${selectedProducts.value}`).then().catch()
      products.value = products.value.filter(
        (val) => !selectedProducts.value.includes(val)
      );
      deleteProductsDialog.value = false;
      selectedProducts.value = null;
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Products Deleted",
        life: 3000,
      });
    };

    return {
      dt,
      products,
      productDialog,
      deleteProductDialog,
      deleteProductsDialog,
      product,
      selectedProducts,
      filters,
      submitted,
      statuses,
      formatCurrency,
      openNew,
      hideDialog,
      saveProduct,
      editProduct,
      confirmDeleteProduct,
      deleteProduct,
      findIndexById,
      createId,
      confirmDeleteSelected,
      deleteSelectedProducts,
    };
  },
};
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 960px) {
    align-items: start;
  }
}

.product-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 50px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
@media screen and (max-width: 960px) {
  ::v-deep(.p-toolbar) {
    flex-wrap: wrap;

    .p-button {
      margin-bottom: 0.25rem;
    }
  }
}
</style>
