
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import axios from "axios";

export default {
  name: "dataTablesVue",
  setup() {
    onMounted(() => {
      axios
        .get("http://localhost:3000/api/v1/records")
        .then((res) => {
          products.value = res.data.record;
          console.log(products.value);
          return products.value;
        })
        .catch(() => {});
    });

    const toast = useToast();
    const dt = ref();
    const products = ref();
    const productDialog = ref(false);
    const deleteProductDialog = ref(false);
    const deleteProductsDialog = ref(false);
    const product = ref({});
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
      submitted.value = true;

      if (product.value.passenger_name.trim()) {
        if (product.value.ticket_number) {
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
      axios.delete(`http://localhost:3000/api/v1/records/${product.value.ticket_number}`).then((res)=>{
        deleteProductDialog.value = false;
      product.value = {};
      toast.add({
        severity: "success",
        summary: res.data.msg,
        detail: "Record Deleted",
        life: 3000,
      });
      }).catch()
      products.value = products.value.filter(
        (val) => val.id !== product.value.id
      );
      
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
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return id;
    };
    const confirmDeleteSelected = () => {
      deleteProductsDialog.value = true;
    };
    const deleteSelectedProducts = () => {
      axios.delete(`http://localhost:3000api/v1/records/${selectedProducts.value}`).then().catch();
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

   console.log("In The scripts");

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


