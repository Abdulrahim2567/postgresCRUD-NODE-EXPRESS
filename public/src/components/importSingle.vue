<template>
  <div class="container">
  <Toast />

      <h5>Advanced</h5>
      <FileUpload name="demo[]" url="https://www.primefaces.org/upload.php" @upload="onAdvancedUpload($event)" :multiple="true" accept="" :maxFileSize="1000000">
          <template #content>
              <ul v-if="uploadedFiles && uploadedFiles[0]">
                  <li v-for="file of uploadedFiles[0]" :key="file">{{ file.name }} - {{ file.size }} bytes</li>
              </ul>
          </template>
          <template #empty>
              <p>Drag and drop files to here to upload.</p>
          </template>
      </FileUpload>
  </div>

      
</template>

<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

export default {
  name: "importSingle",
setup() {
  const toast = useToast();
      const uploadedFile = ref([]);
      const files = ref([]);
      const totalSize = ref(0);
      const totalSizePercent = ref(0);

      const onRemoveTemplatingFile = (file, onFileRemove, index) => {
          onFileRemove(index);
          totalSize.value -= parseInt(this.formatSize(file.size));
          totalSizePercent.value = totalSize.value / 10;
      }

      const onClearTemplatingUpload = (clear) => {
          clear();
          totalSize.value = 0;
          totalSizePercent.value = 0;
      }

      const onSelectedFiles = (event) => {
          files.value = event.files;
          files.value.forEach((file) => {
              totalSize.value += parseInt(this.formatSize(file.size));
          });
      }

      const onAdvancedUpload = () => {
          toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
      }

      const uploadEvent = (callback) => {
          totalSizePercent.value = totalSize.value / 10;
          callback();
      }

      const onTemplatedUpload = () => {
          totalSize.value = 0;
          totalSizePercent.value = 0;
          toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
      }

      const onUpload = () => {
          toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
      }

      const formatSize = (bytes) => {
          if (bytes === 0) {
              return '0 B';
          }

          let k = 1000,
              dm = 3,
              sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
              i = Math.floor(Math.log(bytes) / Math.log(k));

          return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }


  return { onUpload, onRemoveTemplatingFile, onClearTemplatingUpload, onSelectedFiles, onAdvancedUpload, uploadEvent, onTemplatedUpload, onUpload, formatSize };
}
}
</script>

<style lang="scss" scoped>
  ::v-deep(.custom-progress-bar) {
      .p-progressbar-value {
          background-color: #f44336;
      }
  }
</style>