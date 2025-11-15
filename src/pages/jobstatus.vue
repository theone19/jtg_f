<template>
  <v-container class="pa-5" fluid>
    <v-card color="#FFFFFF" style="height: 89vh">
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-account-outline"></v-icon> &nbsp; Job Order

        <v-spacer></v-spacer>

        <v-btn class="bg-green mr-3 ml-5" @click="insertJobOrder()"
          >New <v-icon icon="mdi-plus" end></v-icon
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-row v-if="jobOrder.length <= 0" class="ma-3">
        <v-col>
          <div>
            <v-alert type="info" variant="tonal" class="text-center">
              <span class="text-h5 text-grey-lighten-1">ไม่มีข้อมูล</span>
            </v-alert>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="item in jobOrder" :key="item.jobOrderId" cols="2">
          <v-card class="bg-blue-lighten-5 mt-4 mr-n2 ml-4 mb-4" outlined hover>
            <v-card-title
              class="fontSarabun bg-blue"
              style="font-size: 12px"
              @click="editItem(item.jobOrderId)"
            >
              <v-row>
                <v-col> {{ item.jobOrderNumber }} </v-col>
                <v-col class="text-yellow text-right">
                  {{ item.customerName }}
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="fontSarabun" style="font-size: 12px">
              <v-row class="mt-0 py-0">
                <v-col cols="4" class="pa-2"> เลขที่: </v-col>
                <v-col cols="8" class="pa-2">
                  {{ item.customerBillNumber + "/" + item.customerBillItemNo }}
                </v-col>
              </v-row>
              <v-row class="mt-n3 py-0">
                <v-col cols="4" class="pa-2"> วันที่สั่ง: </v-col>
                <v-col cols="8" class="pa-2">
                  {{ new Date(item.jobDate).toLocaleDateString("en-GB") }}
                </v-col>
              </v-row>
              <v-row class="mt-n3 py-0">
                <v-col cols="4" class="pa-2"> ประเภท: </v-col>
                <v-col cols="8" class="pa-2">
                  {{ item.productTypeName + " | " + item.metalTypeName }}
                </v-col>
              </v-row>
              <v-row class="mt-n3 py-0">
                <v-col cols="4" class="pa-2"> จำนวน: </v-col>
                <v-col cols="8" class="pa-2">
                  {{
                    item.qty +
                    " " +
                    item.unitTypeName +
                    (item.weight > 0 ? " | " + item.weight + " กรัม" : "")
                  }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8">
                  <v-icon
                    color="purple-darken-2"
                    icon="mdi-sticker-text-outline"
                    size="small"
                    @click="printSticker(item.jobOrderId)"
                  ></v-icon>
                  <v-icon
                    color="orange-darken-2"
                    icon="mdi-arrow-up-bold-box-outline"
                    size="small"
                    class="ml-3"
                  ></v-icon>
                </v-col>
                <v-col cols="4">
                  <v-avatar v-if="true" size="38">
                    <v-img
                      alt="John"
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                    ></v-img>
                  </v-avatar>
                </v-col>
              </v-row>
              <!-- <v-row>
                <v-col>
                  เลขที่บิลลูกค้า
                </v-col>
                <v-col>
                  {{ item.customerBillNumber }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  กำหนดเสร็จ
                </v-col>
                <v-col>
                  {{ new Date(item.dueDate).toLocaleDateString() }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  ประเภทสินค้า
                </v-col>
                <v-col>
                  {{ item.productTypeName }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  ประเภทโลหะ
                </v-col>
                <v-col>
                  {{ item.metalTypeName }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  จำนวน
                </v-col>
                <v-col>
                  {{ item.qty }} {{ item.unitTypeName }}
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  น้ำหนัก
                </v-col>
                <v-col>
                  {{ item.weight }} กรัม
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  รายละเอียดงาน
                </v-col>
                <v-col>
                  {{ item.jobDescription }}
                </v-col>
              </v-row> -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!------------------------- dialog ADD --------------------------->
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
          <v-card-title class="bg-green-lighten-4 text-center">
            <span class="fontPromptBold fontSize24 text-green-darken-3"
              >ข้อมูล Job Order</span
            >
          </v-card-title>
          <v-card-text class="mt-2">
            <v-form ref="form1">
              <v-container>
                <v-row>
                  <v-col cols="5">
                    <v-autocomplete
                      v-model="jobOrderData.customerId"
                      label="ลูกค้า"
                      :items="customer"
                      item-title="customerName"
                      item-value="customerId"
                      variant="outlined"
                      density="compact"
                      :rules="[(v) => !!v || 'กรุณาเลือกลูกค้า']"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      v-model="jobOrderData.customerBillNumber"
                      label="เลขที่บิลลูกค้า"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="jobOrderData.customerBillItemNo"
                      label="ลำดับในบิลลูกค้า"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="my-n4">
                  <v-col>
                    <v-text-field
                      v-model="jobOrderData.jobOrderNumber"
                      label="Job Number"
                      :rules="[(v) => !!v || 'ต้องมี Job Number']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-date-input
                      v-model="jobOrderData.jobDate"
                      label="วันที่สั่งงาน"
                      :rules="[(v) => !!v || 'กรุณาป้อนวันที่']"
                      variant="outlined"
                      density="compact"
                    ></v-date-input>
                  </v-col>
                  <v-col>
                    <v-date-input
                      v-model="jobOrderData.dueDate"
                      label="กำหนดเสร็จ"
                      :rules="[(v) => !!v || 'กรุณาป้อนกำหนดเสร็จ']"
                      variant="outlined"
                      density="compact"
                    ></v-date-input>
                  </v-col>
                </v-row>
                <v-row class="my-n4">
                  <v-col>
                    <v-autocomplete
                      v-model="jobOrderData.productTypeId"
                      label="ประเภทสินค้า"
                      :items="productType"
                      item-title="productTypeName"
                      item-value="productTypeId"
                      variant="outlined"
                      density="compact"
                      :rules="[(v) => !!v || 'กรุณาเลือกประเภทสินค้า']"
                    ></v-autocomplete>
                  </v-col>
                  <v-col>
                    <v-autocomplete
                      v-model="jobOrderData.metalTypeId"
                      label="ประเภทโลหะ"
                      :items="metalType"
                      item-title="metalTypeName"
                      item-value="metalTypeId"
                      variant="outlined"
                      density="compact"
                      :rules="[(v) => !!v || 'กรุณาเลือกประเภทโลหะ']"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="my-n4">
                  <v-col>
                    <v-text-field
                      v-model="jobOrderData.qty"
                      label="จำนวน"
                      type="number"
                      variant="outlined"
                      density="compact"
                      :rules="[(v) => !!v || 'กรุณาป้อนจำนวน']"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-autocomplete
                      v-model="jobOrderData.unitTypeId"
                      label="หน่วยนับ"
                      :items="unitType"
                      item-title="unitTypeName"
                      item-value="unitTypeId"
                      variant="outlined"
                      density="compact"
                      :rules="[(v) => !!v || 'กรุณาเลือกหน่วยนับ']"
                    ></v-autocomplete>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="jobOrderData.weight"
                      label="น้ำหนัก (กรัม)"
                      type="number"
                      variant="outlined"
                      density="compact"
                      :rules="[(v) => !!v || 'กรุณาป้อนน้ำหนัก']"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="my-n4">
                  <v-col>
                    <v-textarea
                      v-model="jobOrderData.jobDescription"
                      label="รายละเอียดงาน"
                      variant="outlined"
                      density="compact"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="11">
                    <v-text-field
                      v-model="jobOrderData.billPicture"
                      label="รูปภาพบิลลูกค้า"
                      variant="outlined"
                      density="compact"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-file-input
                      v-model="originalImageFile"
                      label="เลือกรูปภาพบิลลูกค้า"
                      accept="image/png, image/jpeg, image/gif"
                      prepend-icon="mdi-camera"
                      variant="outlined"
                      density="compact"
                      hide-input
                      :disabled="isProcessing"
                      :loading="isProcessing"
                      @change="handleFileUpload"
                      class="mt-2"
                    ></v-file-input>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-img
                      v-if="resizedBase64"
                      :src="resizedBase64"
                      aspect-ratio="1"
                      class="grey lighten-2"
                      max-height="300"
                      contain
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              class="mr-3"
              variant="tonal"
              text
              @click="onSave()"
            >
              บันทึก <v-icon icon="mdi-content-save" end></v-icon
            ></v-btn>
            <v-btn
              color="red darken-1"
              variant="tonal"
              text
              @click="dialog = false"
            >
              ปิด <v-icon icon="mdi-close" end></v-icon
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!------------------------- dialog Delete --------------------------->
      <v-dialog v-model="dialogDelete" max-width="300">
        <v-card class="mx-auto">
          <v-card-title class="text-red text-center mt-1 mr-8 ml-8"
            ><span class="fontSize16 mr-3">ต้องการลบ</span>
            <span class="text-blue fontSize18">{{ deleteText }}</span>
            <span class="fontSize16 ml-3">ใช่หรือไม่ ?</span></v-card-title
          >
          <v-card-actions class="mt-3 mb-1">
            <v-spacer></v-spacer>
            <v-btn
              color="green-darken-1"
              variant="outlined"
              @click="deleteItemConfirm()"
              >ยืนยัน</v-btn
            >
            <v-btn
              color="orange-darken-1"
              variant="outlined"
              @click="dialogDelete = false"
              >ยกเลิก</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { apiUrl, imageUrl } from "../constants";

export default {
  name: "JobOrderPage",
  async mounted() {
    await this.getProductType();
    await this.getCustomer();
    await this.getMetalType();
    await this.getUnitType();
    await this.getJobOrder();
  },
  data: () => ({
    jobOrder: [],
    jobOrderData: {},
    dialog: false,
    dialogDelete: false,
    editMode: false,
    deleteId: 0,
    deleteText: "",
    search: "",
    productType: [],
    customer: [],
    metalType: [],
    unitType: [],
    // Configurable options
    maxWidth: 800,
    maxHeight: 1200,
    imageQuality: 0.8,
    // Component state
    originalImageFile: null,
    originalImageUrl: null,
    resizedBase64: null,
    isImageSave: false,
    // STATE เพิ่มใหม่: สำหรับ Progress
    isProcessing: false, // สถานะว่ากำลังประมวลผลไฟล์หรือไม่
    uploadProgress: 0, // เปอร์เซ็นต์ความคืบหน้า (0-100)
    nopic: imageUrl + "/nopic.jpg",
  }),
  methods: {
    async getProductType() {
      try {
        let result = await axios.get(apiUrl + "/product-type");
        this.productType = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getCustomer() {
      try {
        let result = await axios.get(apiUrl + "/customer");
        this.customer = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getMetalType() {
      try {
        let result = await axios.get(apiUrl + "/metal-type");
        this.metalType = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getUnitType() {
      try {
        let result = await axios.get(apiUrl + "/unit-type");
        this.unitType = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getJobOrder() {
      try {
        let result = await axios.get(apiUrl + "/job-order/all");
        this.jobOrder = result.data;
        console.log(this.jobOrder);
      } catch (error) {
        console.log(error);
      }
    },
    insertJobOrder() {
      this.editMode = false;
      this.jobOrderData = {
        jobOrderNumber: "",
        customerId: null,
        jobDate: new Date(),
        customerBillNumber: "",
        customerBillItemNo: null,
        productTypeId: null,
        metalTypeId: null,
        qty: 1,
        unitTypeId: null,
        weight: 0.0,
        jobDescription: "",
        pricePerUnit: 0,
        dueDate: new Date(),
        billPicture: null,
        status: "",
        remarks: "",
      };
      this.resizedBase64 = null;
      this.isImageSave = false;
      this.dialog = true;
    },
    async onSave() {
      const { valid } = await this.$refs.form1.validate();

      if (valid) {
        if (this.editMode == false) {
          // convert string data
          this.jobOrderData.customerBillItemNo = Number(
            this.jobOrderData.customerBillItemNo
          );
          this.jobOrderData.qty = Number(this.jobOrderData.qty);
          this.jobOrderData.weight = Number(this.jobOrderData.weight);

          // save image
          this.jobOrderData.billPicture = null;
          if (this.resizedBase64) {
            this.jobOrderData.imageData = this.resizedBase64;
            this.jobOrderData.imageSave = this.isImageSave;
          } else {
            this.jobOrderData.imageData = null;
            this.jobOrderData.imageSave = false;
          }

          // console.log(this.jobOrderData);

          try {
            const result = await axios.post(
              apiUrl + "/job-order/createpic",
              this.jobOrderData
            );
            console.log(result.data);
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            // convert string data
            this.jobOrderData.customerBillItemNo = Number(
              this.jobOrderData.customerBillItemNo
            );
            this.jobOrderData.qty = Number(this.jobOrderData.qty);
            this.jobOrderData.weight = Number(this.jobOrderData.weight);

            // save image
            if (this.resizedBase64) {
              this.jobOrderData.imageData = this.resizedBase64;
              this.jobOrderData.imageSave = this.isImageSave;
            } else {
              this.jobOrderData.imageData = null;
              this.jobOrderData.imageSave = false;
            }

            await axios.put(
              apiUrl + "/job-order/updatepic/" + this.jobOrderData.jobOrderId,
              this.jobOrderData
            );
          } catch (error) {
            console.log(error);
          }
        }
        await this.getJobOrder();
        this.dialog = false;
      }
    },
    async editItem(id) {
      try {
        let result = await axios.get(apiUrl + "/job-order/by-id/" + id);
        this.jobOrderData = result.data;
        if (!!!this.jobOrderData.billPicture) {
          this.jobOrderData.billPicture = null;
          this.resizedBase64 = null;
          this.isImageSave = false;
        } else {
          
          this.resizedBase64 = await this.imageUrlToBase64(
            imageUrl + this.jobOrderData.billPicture
          );
          this.isImageSave = false;
        }
        this.editMode = true;
        this.dialog = true;
      } catch (error) {
        console.log(error);
      }
    },
    deleteItem(id, name) {
      this.deleteId = id;
      this.deleteText = name;
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      try {
        await axios.delete(apiUrl + "/job-order/delete/" + this.deleteId);
      } catch (error) {
        console.log(error);
      }
      await this.getJobOrder();
      this.dialogDelete = false;
    },
    printSticker(id) {
      // window.open(apiUrl + "/job-order/print-sticker/" + id, "_blank");
      alert("Print Sticker ID: " + id);
    },
    handleFileUpload() {
      // const file = this.employeeData.empPicture;
      const file = this.originalImageFile;

      if (!file) {
        this.originalImageFile = null;
        this.resizedBase64 = null;
        this.isImageSave = false;
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
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

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

          this.resizedBase64 = canvas.toDataURL(
            "image/jpeg",
            this.imageQuality
          );

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
      this.isImageSave = true;
    },
    async imageUrlToBase64(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // เพื่อหลีกเลี่ยงปัญหา CORS
        img.src = url;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };

        img.onerror = (error) => {
          reject(error);
        };
      });
    },
  },
};
</script>

<style></style>
