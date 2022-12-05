<template>
  <router-link
          to="/"
          class="p-button-link mb-4"
          >Home</router-link
        >
  <div class="container mt-3 mb-3">
    <div class="card">
      <DataTable
        id="tableId"
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
            <h5 class="mb-2 md:m-0 p-as-md-center bold">
              <router-link
                to="/"
                class="pi pi-angle-left text-primary px-3 mt-1 py-0 home"
              ></router-link>
              ALL TICKETS
            </h5>
            <span class="p-input-icon-left">
              <i class="pi pi-search " />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </span>
          </div>
        </template>

        <Column selectionMode="multiple" :exportable="false"></Column>

        <Column  field="passenger_name" header="Travel" :sortable="true" class="font">
          <template #body="slotProps">
            <div class="displayTravel font here">
              <span class="displayTravel font" style="font-weight: bold;">{{ slotProps.data.passenger_name }}</span>
              <span class="displayTravel grey font" >{{ slotProps.data.itinerary }}</span>
              <span class="displayTravel font">
                <span class = "blue bold font">{{slotProps.data.airline + " "}}</span><span class = "blue bold font">{{slotProps.data.number}} | </span>
                <span class="bold grey font">{{slotProps.data.issuing_date}}</span>
              </span>
            </div>
          </template>
        </Column>
        <Column field="amount" header="Amount" :sortable="true" class="font">
            <template #body="slotProps">
            <div class="displayTravel font">
              <span class="displayTravel"><span class="light-green bold font">{{( slotProps.data.currency +' ')}}</span>
              <span style="font-weight: bold;" clas = "font">{{(slotProps.data.amount)}}</span></span>
              <span class="displayTravel grey font">{{ slotProps.data.days }}</span>
              <span :class="slotProps.data.statusColor">{{
                slotProps.data.flight_status
              }}</span>
            </div>
          </template>
        </Column>

        <Column :exportable="false">
          <template #body="slotProps">
            <Button style="margin-right: 2.5px; margin-left: 2.5px; border: none;"
              icon="pi pi-pencil"
              id="btn-edit"
              class="p-button mr-2 btn-edit"
              @click="editProduct(slotProps.data)"
            />
            <Button style="margin-left: 2.5px; margin-right: 2.5px; border: none;"
              icon="pi pi-trash"
              class="p-button btn-delete"
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
        <Calendar
            id="date"
            v-model="product.issuing_date"
            :class="{ 'p-invalid': submitted && !product.issuing_date }"
            class="mb-2 putLa"
            :showIcon="true"
            required="true"
          />
       
        <small class="p-error" v-if="submitted && !product.issuing_date"
          >Issuing Date is required.</small
        >
      </div>
      <div class="field">
        <label for="name">Travel Type</label>
        <Dropdown
            v-model="product.travel_type"
            :options="type"
            class="mb-2 putLa"
          />
        <small class="p-error" v-if="(submitted && !product.travel_type)"
          >Flight Type is required.</small
        >
      </div>
      <div class="field">
        <label for="name">Itinerary</label>
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
          class="p-button-secondary"
          @click="hideDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check-circle"
          class="p-button-success"
          @click="saveProduct"
        />
      </template>
    </Dialog>

    <Dialog
      icon = "pi pi-exclamation-triangle mr-3"
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <em class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem;" />
        <span v-if="product"
          >Are you sure you want to delete <strong>{{ product.passenger_name }}</strong>?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-secondary p-2 px-3"
          @click="deleteProductDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-danger p-2 px-3"
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
        <em class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Are you sure you want to delete the selected products?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductsDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>
  </div>
</template>

<script  type="application/javascript" src="./scripts/dataTables.js"></script>

<style scoped>@import "./css/dataTables.css"</style>
