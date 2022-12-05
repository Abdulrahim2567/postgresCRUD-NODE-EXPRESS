<template>
  <div class="container height row box ">
    <div class="center ">
      <div class="row d-flex justify-content-center">
        <Button
          to="itemNew"
          label="New Ticket"
          class="col-4 buttons square"
          style="background-color: #cf1e07c7"
          @click="openNew"
        />
        <!-- <router-link to="importSingle" class="col-4 buttons square" style=" background-color:#4caf50;">Import Single</router-link> -->
        <div
          class="col-4 buttons square"
          style="background-color: rgba(15, 212, 9, 0.904)"
        >
          <FileUpload
            mode="basic"
            @upload="onTemplatedUpload($event)"
            accept=".AIR"
            :maxFileSize="1000000"
            :auto="true"
            name="demo[]"
            @select="onSelectedFiles"
            chooseLabel="Import single"
            style="background-color: rgba(15, 212, 9, 0.904); border: none;"
          />
        </div>
        <div class="col-4 buttons square" style="background-color: #155df7c7">
          <FileUpload
            mode="basic"
            @upload="onTemplatedUpload($event)"
            accept=".AIR"
            :maxFileSize="1000000"
            :auto="true"
            :multiple="true"
            name="demo[]"
            @select="onSelectedFiles"
            chooseLabel="Import Batch"
            style="background-color: #155df7c7; border: none"
          />
        </div>

        <router-link
          to="dataTablesVue"
          class="col-4 buttons square"
          style="background-color: #a59b0bc7"
          >Show Tickets</router-link
        >
      </div>
    </div>

    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Add Ticket"
      :modal="true"
      class="p-fluid"
    >
      <div class="formgrid grid">
        <div class="field d-flex">
          <label for="firstname2" class="labels">Ticket No</label>
          <InputNumber
            v-model="product.airline"
            mode="decimal"
            :min="0"
            :max="999"
            class="mb-2 put"
            placeholder = "392"
          />
          <InputNumber
            v-model="product.number"
            mode="decimal"
            placeholder="524895455"
            class="mb-2 putL"
          />
        </div>
        <div class="field d-flex">
          <label for="lastname2" class="labels">Passager Name</label>
          <InputText
            id="username"
            type="text"
            class="mb-2 putLa"
            v-model="product.passenger_name"
            placeholder = "Abdulrahim Ibn kibuh"
          />
        </div>
        <div class="field d-flex">
          <label for="firstname2" class="labels">Issuing Date</label>
          <Calendar
            id="date"
            v-model="product.issuing_date"
            class="mb-2 putLa"
            :showIcon="true"
            :placeholder = "new Date().toLocaleDateString()"
            :defaultValue = "new Date().toLocaleDateString()"
          />
        </div>
        <div class="field d-flex">
          <label for="lastname2" class="labels">Travel Type</label>
          <Dropdown
            v-model="product.travel_type"
            :options="type"
            class="mb-2 putLa"
            placeholder = "Flight"
            defaultValue = "Flight"
          />
        </div>
        <div class="field d-flex">
          <label for="firstname2" class="labels">Itinerary</label>
          <InputText
            id="username"
            type="text"
            class="mb-2 putLa"
            v-model="product.itinerary"
            placeholder = "ACC TML TML ACC"
          />
        </div>
        <div class="field d-flex">
          <label for="lastname2" class="labels">Amount</label>
          <!-- <span class="input-group-text mb-2 putCurr" id="basic-addon1"
            >XAF</span -->
          <select v-model="product.currency" placeholder="XAF" class="input-group-text mb-2 putCurr">
            <option selected value="XAF">XAF</option>
            <option value="£">£</option>
            <option value="$">$</option>
          </select>
          
          <InputNumber
            v-model="product.amount"
            mode="decimal"
            class="mb-2 putL"
            placeholder = "250,000"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-danger"
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
  </div>
</template>

<script type="application/javascript" src="./scripts/homepage.js"></script>

<style scoped>@import "./css/homepage.css" </style>