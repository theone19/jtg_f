<template>
  <v-container class="pa-5" fluid>
    <v-card color="#ffffff">
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-account-outline"></v-icon> &nbsp; ข้อมุลพนักงาน

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          density="compact"
          label="ค้นหา"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>

        <v-btn class="bg-green mr-3 ml-5" @click="insertEmployee()"
          >New <v-icon icon="mdi-plus" end></v-icon
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="employee"
        :search="search"
        class="elevation-10"
      >
        <template
          v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }"
        >
          <tr class="bg-blue-lighten-5">
            <template v-for="column in columns" :key="column.key">
              <th>
                <div class="d-flex align-center">
                  <span
                    class="me-2 cursor-pointer text-blue-darken-4 fontPrompt fontSize14"
                    @click="toggleSort(column)"
                    v-text="column.title"
                  ></span>
                  <v-icon
                    v-if="isSorted(column)"
                    :icon="getSortIcon(column)"
                    color="medium-emphasis"
                  ></v-icon>
                </div>
              </th>
            </template>
          </tr>
        </template>

        <template v-slot:item="{ item }">
          <tr class="fontSarabun fontSize14">
            <td>
              <v-icon
                size="small"
                class="ml-3"
                @click="editItem(item.employeeId)"
                color="blue"                
              >
                mdi-pencil
              </v-icon>
            </td>
            <td>{{ item.fullName }}</td>
            <td>{{ item.departmentName }}</td>
            <td>{{ item.jobTitle }}</td>
            <td>{{ item.phoneNumber }}</td>
            <td>
              <v-img
                v-if="item.empPicture"
                :src="item.empPicture"
                aspect-ratio="1"
                class="grey lighten-2 py-2"
                max-height="100"
                max-width="80"
                contain
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <!-- <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular> -->
                    <v-img
                      :src="nopic"
                      aspect-ratio="1"
                      class="grey lighten-2 py-2"
                      max-height="100"
                      max-width="80"
                      contain
                    ></v-img>
                  </v-row>
                </template>
              </v-img>
            </td>
            <td>
              <v-icon
                size="small"
                @click="deleteItem(item.employeeId, item.fullName)"
                color="red"
              >
                mdi-trash-can-outline
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!------------------------- dialog ADD / EDIT --------------------------->
      <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
          <v-card-title class="bg-blue-lighten-4 text-center">
            <span class="fontPromptBold fontSize24 text-blue-darken-3"
              >ข้อมูลพนักงาน</span
            >
          </v-card-title>
          <v-card-text class="mt-2">
            <v-form ref="form1">
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="employeeData.firstName"
                      label="ชื่อ"
                      :rules="[(v) => !!v || 'กรุณาป้อนชื่อ']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="employeeData.lastName"
                      label="นามสกุล"
                      :rules="[(v) => !!v || 'กรุณาป้อนนามสกุล']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n5">
                  <v-col>
                    <v-text-field
                      v-model="employeeData.email"
                      label="อีเมล"
                      :rules="[(v) => !!v || 'กรุณาป้อนอีเมล']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="employeeData.phoneNumber"
                      label="เบอร์โทรศัพท์"
                      :rules="[(v) => !!v || 'กรุณาป้อนเบอร์โทรศัพท์']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-n5">
                  <v-col>
                    <v-autocomplete
                      v-model="employeeData.departmentId"
                      label="แผนก"
                      :items="department"
                      item-title="departmentName"
                      item-value="departmentId"
                      variant="outlined"
                      density="compact"
                      :rules="[(v) => !!v || 'กรุณาเลือกแผนก']"
                    ></v-autocomplete>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="employeeData.jobTitle"
                      label="ตำแหน่งงาน"
                      :rules="[(v) => !!v || 'กรุณาป้อนตำแหน่งงาน']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="11">
                    <v-text-field
                      v-model="employeeData.empPicture"
                      label="รูปภาพพนักงาน"
                      variant="outlined"
                      density="compact"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-file-input
                      v-model="originalImageFile"
                      label="เลือกรูปภาพพนักงาน"
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
            <v-btn color="green darken-1" class="mr-3" variant="tonal" text @click="onSave()">
              บันทึก <v-icon icon="mdi-content-save" end></v-icon
            ></v-btn>
            <v-btn color="red darken-1" variant="tonal" text @click="dialog = false">
              ปิด <v-icon icon="mdi-close" end></v-icon
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!------------------------- dialog Delete --------------------------->
      <v-dialog v-model="dialogDelete" max-width="300">
        <v-card class="mx-auto">
          <!-- <v-card-title class="text-red text-center mt-1 mr-8 ml-8"
            ><div class="fontSize16 mb-3">ต้องการลบ</div>
            <div class="text-blue fontSize18">{{ deleteText }}</div>
            <div class="fontSize16 mt-3">ใช่หรือไม่ ?</div></v-card-title
          > -->
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
  name: "EmployeePage",
  async mounted() {
    await this.getDepartment();
    await this.getEmployee();
  },
  data: () => ({
    employee: [],
    employeeData: {
      namePrefix: null,
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      hireDate: new Date(),
      jobTitle: null,
      departmentId: null,
      birthDate: new Date(),
      idCardNumber: null,
      address: null,
      salary: null,
      remarks: null,
      isWorking: true,
      empPicture: null,
    },
    headers: [
      {
        title: "",
        key: "edit",
        sortable: false,
      },
      {
        key: "fullName",
        title: "ชื่อ",
        align: "center",
      },
      {
        key: "deartmentName",
        title: "แผนก",
      },
      {
        key: "jobTitle",
        title: "ตำแหน่งงาน",
      },
      {
        key: "phoneNumber",
        title: "โทรศัพท์",
      },
      {
        key: "empPicture",
        title: "รูปภาพ",
      },
      {
        title: "",
        key: "delete",
        sortable: false,
      },
    ],
    department: [],
    dialog: false,
    dialogDelete: false,
    editMode: false,
    deleteId: 0,
    deleteText: "",
    search: "",
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
    async getDepartment() {
      try {
        let result = await axios.get(apiUrl + "/department");
        this.department = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getEmployee() {
      try {
        let result = await axios.get(apiUrl + "/employee/all");
        this.employee = result.data;
        for (let i = 0; i < this.employee.length; i++) {
          if (!!!this.employee[i].empPicture)
            this.employee[i].empPicture = null;
          else
            this.employee[i].empPicture =
              imageUrl + "/" + this.employee[i].empPicture;
        }
        // console.log(this.employee);
      } catch (error) {
        console.log(error);
      }
    },
    insertEmployee() {
      this.editMode = false;
      this.employeeData.namePrefix = "";
      this.employeeData.firstName = "";
      this.employeeData.lastName = "";
      this.employeeData.email = "";
      this.employeeData.phoneNumber = "";
      this.employeeData.hireDate = new Date();
      this.employeeData.jobTitle = "";
      this.employeeData.departmentId = null;
      this.employeeData.birthDate = new Date();
      this.employeeData.idCardNumber = "";
      this.employeeData.address = "";
      this.employeeData.salary = 0;
      this.employeeData.remarks = "";
      this.employeeData.isWorking = true;
      this.employeeData.empPicture = null;
      this.originalImageFile = null;
      this.resizedBase64 = null;
      this.isImageSave = false;
      this.dialog = true;
    },
    async onSave() {
      const { valid } = await this.$refs.form1.validate();
      // console.log("Form valid:", valid);

      if (valid) {
        // Add New Record
        if (this.editMode == false) {
          try {
            this.employeeData.empPicture = null;
            if (this.resizedBase64) {
              this.employeeData.imageData = this.resizedBase64;
              this.employeeData.imageSave = this.isImageSave;
            } else {
              this.employeeData.imageData = null;
              this.employeeData.imageSave = false;
            }

            await axios.post(
              apiUrl + "/employee/createpic",
              this.employeeData
            );
            // console.log(result.data);
          } catch (error) {
            console.log(error);
          }
        } else {
          // Edit Record
          try {
            if (this.resizedBase64) {
              this.employeeData.imageData = this.resizedBase64;
              this.employeeData.imageSave = this.isImageSave;
            } else {
              this.employeeData.imageData = null;
              this.employeeData.imageSave = false;
            }
            await axios.put(
              apiUrl + "/employee/updatepic/" +
                this.employeeData.employeeId,
              this.employeeData
            );
            // console.log(result.data);            
          } catch (error) {
            console.log(error);
          }
        }
        await this.getEmployee();
        this.dialog = false;
      }
    },
    async editItem(id) {
      try {
        let result = await axios.get(apiUrl + "/employee/by-id/" + id);
        this.employeeData = result.data;
        if (!!!this.employeeData.empPicture) {
          this.employeeData.empPicture = null;
          this.resizedBase64 = null;
          this.isImageSave = false;
        } else {
          // this.employeeData.empPicture =
          //   imageUrl + this.employeeData.empPicture;
          this.resizedBase64 = await this.imageUrlToBase64(
            imageUrl + this.employeeData.empPicture
          );
          this.isImageSave = false;
        }
        // console.log(this.employeeData);
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
        await axios.delete(apiUrl + "/employee/delete/" + this.deleteId);
      } catch (error) {
        console.log(error);
      }
      await this.getEmployee();
      this.dialogDelete = false;
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

<style>
</style>
