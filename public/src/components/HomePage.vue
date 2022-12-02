<template>
  <div class="container pt-3">
    <div class="center">
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
            style="background-color: rgba(15, 212, 9, 0.904); border: none"
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
          >List</router-link
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
            :min="100"
            :max="999"
            class="mb-2 put"
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
          />
        </div>
        <div class="field d-flex">
          <label for="firstname2" class="labels">Issuing Date</label>
          <Calendar
            id="date"
            v-model="product.issuing_date"
            class="mb-2 putLa"
            :showIcon="true"
          />
        </div>
        <div class="field d-flex">
          <label for="lastname2" class="labels">Travel Type</label>
          <Dropdown
            v-model="product.travel_type"
            :options="type"
            optionLabel="name"
            class="mb-2 putLa"
          />
        </div>
        <div class="field d-flex">
          <label for="firstname2" class="labels">Itinerary</label>
          <InputText
            id="username"
            type="text"
            class="mb-2 putLa"
            v-model="product.itinerary"
          />
        </div>
        <div class="field d-flex">
          <label for="lastname2" class="labels">Amount</label>
          <span class="input-group-text mb-2 putCurr" id="basic-addon1"
            >XAF</span
          >
          <InputNumber
            v-model="product.amount"
            mode="decimal"
            class="mb-2 putL"
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
          icon="pi pi-check"
          class="p-button-success"
          @click="saveProduct"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import ProductService from "./service/productService";
import axios from "axios";

export default {
  name: "HomePage",
  components: {},
  data() {
    return {
      Ticket: {
        issuDate: null,
      },
      selectedType: null,
      type: [
        { name: "Flight" },
        { name: "Hotel" },
        { name: "Car" },
        { name: "Misc" },
      ],
    };
  },
  setup() {
    const onSelectedFiles = (event) => {
      console.log(event.files[0].name);

      for (const element of event.files) {
        const reader = new FileReader();
        reader.onload = async () => {
          console.log("reader.result.toString()==>" + reader.result.toString());
          let objectFile = extractData(reader.result.toString());
          await axios
            .post("http://localhost:3000/api/v1/records", objectFile)
            .then(() => {
              initializeProduct();
            })
            .catch(() => {})
         
        };

        reader.readAsText(element);
      }
    };

    function extractData(file) {
      const regex = /^D-([\d]{6})|^H-[\d]*;[\w\d]{4}([\w\d]{3});[\w\s]+;([\w]{3})|^K[\w]+;\w([a-zA-Z]+)([\d.]+)|^I[-\d]+;[\d]+([\w\s\/]+)|^T-\w([\d]+)-([\d]+)\s/gm;
      let iti = "";
      console.log("conten of file====>" + file);
      let m;
      console.log("fliType==>" + typeof file);
      while ((m = regex.exec(file)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.

        m.forEach((match, groupIndex) => {
          //console.log(`Found match, group ${groupIndex}: ${match}`);
          if (groupIndex == 1 && match !== undefined) {
            let arr = match.split("");
            const str =
              "20" +
              arr[0] +
              arr[1] +
              "-" +
              arr[2] +
              arr[3] +
              "-" +
              arr[4] +
              arr[5];
            const date = new Date(str);
            product.issuing_date = date;
            console.log(date);
          }
          if (groupIndex == 2 && match !== undefined) {
            iti += match + " ";
            console.log(match);
          }
          if (groupIndex == 3 && match !== undefined) {
            iti += match + " ";

            console.log(match);
          }
          if (groupIndex == 4 && match !== undefined) {
            product.currency = match;
            console.log(match);
          }
          if (groupIndex == 5 && match !== undefined) {
            product.amount = match;
            console.log(match);
          }
          if (groupIndex == 6 && match !== undefined) {
            let array = match.split("/");
            product.passenger_name = array[0] + " " + array[1];
            console.log(match);
          }
          if (groupIndex == 7 && match !== undefined) {
            product.airline = match;
            console.log(match);
          }
          if (groupIndex == 8 && match !== undefined) {
            product.number = match;
            console.log(match);
          }
        });
      }
      product.itinerary = iti;
      product.travel_type = "Flight";
      console.log("product.itinerary==>" + product.itinerary);
      return product;
    }

    const onTemplatedUpload = () => {
      totalSize.value = 0;
      totalSizePercent.value = 0;
      toast.add({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
        life: 3000,
      });
    };

    onMounted(() => {
      productService.value
        .getProducts()
        .then((data) => (products.value = data));
    });

    const toast = useToast();
    const dt = ref();
    const products = ref();
    const productDialog = ref(false);
    const deleteProductDialog = ref(false);
    const deleteProductsDialog = ref(false);
    const product = reactive({
      airline: "",
      number: "",
      passenger_name: "",
      amount: "",
      travel_type: "",
      issuing_date: "",
      itinerary: "",
      currency: "",
    });
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
      product.travel_type = product.travel_type.name;
      delete product.value;
      axios
        .post("http://localhost:3000/api/v1/records", product)
        .then(() => {
          submitted.value = true;
          console.log("form==>" + product.issuing_date);

          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Ticket Created",
            life: 3000,
          });

          productDialog.value = false;
          initializeProduct();
        })
        .catch(() => {});
    };

    const initializeProduct = () => {
      product.amount = "";
      product.airline = "";
      product.number = "";
      product.passenger_name = "";
      product.amount = "";
      product.travel_type = "";
      product.issuing_date = "";
      product.itinerary = "";
      product.currency = "";
    };

    return {
      initializeProduct,
      dt,
      extractData,
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
      onSelectedFiles,
      onTemplatedUpload,
    };
  },
};

</script>

<style lang="scss" scoped>
.col-4:hover {
  transform: scale(1.1);
  line-height: 90px;
  border-radius: 10px;
}

.buttons {
  //   background-color: #cf1e07c7; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;
  font-size: 16px;
  margin: 25px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.put {
  padding: none;
  width: 68px;
}

.putCurr {
  padding: none;
  width: 68px;
  background: greenyellow;
}

.putL {
  width: 300px;
}

.putLa {
  width: 350px;
}

.labels {
  width: 120px;
}
</style>
