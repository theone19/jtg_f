<template>
  <v-container class="pa-5" fluid>
    <v-card color="#FFFFFF" style="height: 89vh;">
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
          <v-card class="bg-blue-lighten-5 mt-4 ml-4 mb-4" outlined hover>
            <v-card-title class="fontSarabun" style="font-size: 12px;">{{ item.jobOrderNumber }}</v-card-title>
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
import { apiUrl } from "../constants";

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
        let result = await axios.get(apiUrl + "/job-order");
        this.jobOrder = result.data;
        console.log(this.jobOrder);
      } catch (error) {
        console.log(error);
      }
    },
    insertJobOrder() {
      this.editMode = false;
      this.jobOrderData = {
        jobOrderNumber: '',
        customerId: null,
        jobDate: new Date(),
        customerBillNumber: '',
        customerBillItemNo: null,
        productTypeId: null,
        metalTypeId: null,
        qty: 1,
        unitTypeId: null,
        weight: 0.0,
        jobDescription: '',
        pricePerUnit: 0,
        dueDate: new Date(),
        billPicture: null,
        status: '',
        remarks: '',
      };
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

          console.log(this.jobOrderData);

          try {
            const result = await axios.post(
              apiUrl + "/job-order/create",
              this.jobOrderData
            );
            console.log(result.data);
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await axios.put(
              apiUrl + "/job-order/update/" + this.jobOrderData.jobOrderId,
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
  },
};
</script>

<style></style>
