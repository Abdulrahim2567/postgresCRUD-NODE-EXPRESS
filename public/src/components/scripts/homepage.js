import { ref, reactive, onMounted, defineComponent } from "vue";
import { useToast } from "primevue/usetoast";
import axios from "axios";

export default defineComponent({
  name: "HomePage",
  components: {},
  data() {
    return {
      
      selectedType: null,
      type: [
        "Flight",
        "Hotel",
        "Car",
        "Misc"
      ],
      currency:[
        "XAF", "$", "€", "£", "¥"
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
              toast.add({severity:'success', summary: 'Success message', detail:'File was uploaded', life: 3000});
              initializeProduct();
            })
            .catch((error) => {
              console.log('error.data.errmsg==>'+error.data);
              toast.add({severity:'error', summary: 'Error message', detail:'File was not uploaded', life: 3000});
            })
         
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
      
    });

    const toast = useToast();
    const productDialog = ref(false);
    const product = reactive({
      airline: null,
      number: null,
      passenger_name: null,
      amount: null,
      travel_type: null,
      issuing_date: null,
      itinerary: null,
      currency: null,
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
      
      delete product.value;
      product.airline = product.airline.toString()
      product.number = product.number.toString()
      console.log('product.number==>'+typeof(product.number)); 

      axios
        .post("http://localhost:3000/api/v1/records", product)
        .then(() => {
          toast.add({severity:'success', summary: 'Success message', detail:'Ticket created', life: 3000});
          submitted.value = true;
          console.log("form==>" + product.issuing_date);
          productDialog.value = false;
          initializeProduct();
          
        })
        .catch(() => {
          toast.add({severity:'error', summary: 'Error message', detail:'Ticket was not created', life: 3000});
        });
    };

    const initializeProduct = () => {
      product.amount = null;
      product.airline = null;
      product.number = null;
      product.passenger_name = null;
      product.amount = null;
      product.travel_type = null;
      product.issuing_date = null;
      product.itinerary = null;
      product.currency = null;
    };

    return {
      initializeProduct,
      extractData,
      productDialog,
      product,
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
});