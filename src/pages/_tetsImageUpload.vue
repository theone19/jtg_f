<template>
  <v-container>
    <v-card class="mx-auto" max-width="800">
      <v-card-title class="text-h5 font-weight-bold">
        🖼️ Image Resizer & Base64 Converter
      </v-card-title>
      <v-card-subtitle>
        Upload an image, it will be resized and converted to Base64 format.
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-progress-linear
        v-if="isProcessing"
        :value="uploadProgress"
        color="primary"
        height="20"
        striped
        stream
      >
        <template v-slot:default>
          <strong>{{ Math.ceil(uploadProgress) }}%</strong>
        </template>
      </v-progress-linear>

      <v-card-text>
        <v-file-input
          v-model="originalImageFile"
          label="Select an image"
          accept="image/png, image/jpeg, image/gif"
          prepend-icon="mdi-camera"
          outlined
          dense
          :disabled="isProcessing"
          :loading="isProcessing"
          @change="handleFileUpload"
        ></v-file-input>

        <v-row v-if="originalImageUrl || resizedBase64">
          <v-col cols="12" md="6">
            <h3 class="mb-2">Original Image</h3>
            <v-img
              v-if="originalImageUrl"
              :src="originalImageUrl"
              aspect-ratio="1"
              class="grey lighten-2"
              max-height="300"
              contain
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>

          <v-col cols="12" md="6">
            <h3 class="mb-2">Resized Image (Preview)</h3>
            <v-img
              v-if="resizedBase64"
              :src="resizedBase64"
              aspect-ratio="1"
              class="grey lighten-2"
              max-height="300"
              contain
            >
               <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>
      </v-card-text>

      <div v-if="resizedBase64">
        <v-divider></v-divider>
        <v-card-text>
            <h3 class="mb-2">✨ Base64 Result</h3>
          <v-textarea
            v-model="resizedBase64"
            label="Base64 String"
            readonly
            auto-grow
            outlined
            rows="5"
          ></v-textarea>
        </v-card-text>
      </div>

    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'ImageUploader',
  data() {
    return {
      // Configurable options
      maxWidth: 800,
      maxHeight: 800,
      imageQuality: 0.8,

      // Component state
      originalImageFile: null,
      originalImageUrl: null,
      resizedBase64: null,

      // STATE เพิ่มใหม่: สำหรับ Progress
      isProcessing: false,     // สถานะว่ากำลังประมวลผลไฟล์หรือไม่
      uploadProgress: 0,       // เปอร์เซ็นต์ความคืบหน้า (0-100)
    };
  },
  methods: {
    handleFileUpload() {
      const file = this.originalImageFile;

      if (!file) {
        this.originalImageUrl = null;
        this.resizedBase64 = null;
        return;
      }

      // เริ่มกระบวนการ: รีเซ็ตค่าและตั้งสถานะ
      this.isProcessing = true;
      this.uploadProgress = 0;
      this.resizedBase64 = null; // เคลียร์ผลลัพธ์เก่า
      
      this.originalImageUrl = URL.createObjectURL(file);
      this.resizeAndEncodeImage(file);
    },

    resizeAndEncodeImage(file) {
      const reader = new FileReader();
      
      // LOGIC เพิ่มใหม่: ติดตามความคืบหน้าการอ่านไฟล์
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          // คำนวณเปอร์เซ็นต์จากข้อมูลที่โหลดแล้วเทียบกับขนาดทั้งหมด
          const percentComplete = (event.loaded / event.total) * 100;
          this.uploadProgress = percentComplete;
        }
      };
      
      reader.onload = (event) => {
        this.uploadProgress = 100; // เมื่ออ่านเสร็จ ให้เต็ม 100%
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > this.maxWidth) {
              height = Math.round((height * this.maxWidth) / width);
              width = this.maxWidth;
            }
          } else {
            if (height > this.maxHeight) {
              width = Math.round((width * this.maxHeight) / height);
              height = this.maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);
          
          this.resizedBase64 = canvas.toDataURL('image/jpeg', this.imageQuality);

          // สิ้นสุดกระบวนการ
          this.isProcessing = false; 
        };

        img.onerror = (error) => {
            console.error("Error loading image:", error);
            this.isProcessing = false; // หยุดเมื่อมี error
        };
      };
      
      reader.onerror = (error) => {
          console.error("Error reading file:", error);
          this.isProcessing = false; // หยุดเมื่อมี error
      };

      // เริ่มอ่านไฟล์
      reader.readAsDataURL(file);
    },
  },
};
</script>

<style scoped>
h3 {
  color: #555;
  font-weight: 500;
}
</style>