<template>
  <v-container class="pa-5" fluid>    
    <v-card color="#FFFFFF">
      
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-account-outline"></v-icon> &nbsp; ข้อมูลลูกค้า

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

        <v-btn class="bg-green mr-3 ml-5" @click="insertCustomer()"
          >New <v-icon icon="mdi-plus" end></v-icon
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="customer"
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

                  <!-- <v-icon
                    v-if="column.removable"
                    color="medium-emphasis"
                    icon="$close"
                    @click="remove(column.key)"
                  ></v-icon> -->
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
                @click="editItem(item.customerId)"
                color="blue"
              >
                mdi-pencil
              </v-icon>
            </td>
            <td>{{ item.customerName }}</td>
            <td>{{ item.contactName }}</td>
            <td>{{ item.address }}</td>
            <td>{{ item.city }}</td>
            <td>{{ item.postalCode }}</td>            
            <td>{{ item.phone }}</td>
            <!-- <td>Test</td> -->
            <td>
              <v-icon
                size="small"
                @click="deleteItem(item.customerId, item.customerName)"
                color="red"
              >
                mdi-trash-can-outline
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!------------------------- dialog ADD --------------------------->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title class="bg-blue-lighten-4 text-center">
            <span class="fontPromptBold fontSize24 text-blue-darken-3"
              >ข้อมูลลูกค้า</span
            >
          </v-card-title>
          <v-card-text class="mt-2">
            <v-form ref="form1">
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="customerData.customerName"
                      label="ชื่อลูกค้า"
                      :rules="[(v) => !!v || 'กรุณาป้อนชื่อลูกค้า']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>                  
                </v-row>
                <v-row class="my-n4">
                  <v-col>
                    <v-text-field
                      v-model="customerData.contactName"
                      label="ชื่อผู้ติดต่อ"
                      :rules="[(v) => !!v || 'กรุณาป้อนชื่อผู้ติดต่อ']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="customerData.phone"
                      label="โทรศัพท์"
                      :rules="[(v) => !!v || 'กรุณาป้อนโทรศัพท์']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="my-n4">
                  <v-col>
                    <v-textarea
                      v-model="customerData.address"
                      label="ที่อยู่"
                      :rules="[(v) => !!v || 'กรุณาป้อนที่อยู่']"
                      variant="outlined"
                      density="compact"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row class="my-n4">
                  <v-col>
                    <v-text-field
                      v-model="customerData.city"
                      label="จังหวัด"
                      :rules="[(v) => !!v || 'กรุณาป้อนจังหวัด']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="customerData.postalCode"
                      label="รหัสไปรษณีย์"
                      :rules="[(v) => !!v || 'กรุณาป้อนรหัสไปรษณีย์']"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
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
  name: "CustomerPage",
  async mounted() {
    await this.getCustomer();
  },
  data: () => ({
    customer: [],
    customerData: {
      customerName: "",
      contactName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      phone: "",
    },
    headers: [
      {
        title: "",
        key: "edit",
        sortable: false,
      },
      {
        key: "customerName",
        title: "ชื่อลูกค้า",
      },
      {
        key: "contactName",
        title: "ชื่อผู้ติดต่อ",
      },
      {
        key: "address",
        title: "ที่อยู่",
      },
      {
        key: "city",
        title: "เมือง",
      },
      {
        key: "postalCode",
        title: "รหัสไปรษณีย์",
      },      
      {
        key: "phone",
        title: "โทรศัพท์",
      },
      {
        title: "",
        key: "delete",
        sortable: false,
      },
    ],
    dialog: false,
    dialogDelete: false,
    editMode: false,
    deleteId: 0,
    deleteText: "",
    search: "",
  }),
  methods: {
    async getCustomer() {
      try {
        let result = await axios.get(apiUrl + "/customer");
        this.customer = result.data;
      } catch (error) {
        console.log(error);
      }
    },
    insertCustomer() {
      this.editMode = false;
      this.customerData.customerName = "";
      this.customerData.contactName = "";
      this.customerData.address = "";
      this.customerData.city = "";
      this.customerData.postalCode = "";
      this.customerData.country = "Thailand";
      this.customerData.phone = "";
      this.dialog = true;
    },
    async onSave() {
      const { valid } = await this.$refs.form1.validate();

      if (valid) {
        if (this.editMode == false) {
          try {            
            const result = await axios.post(
              apiUrl + "/customer/create",
              this.customerData
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          try {            
            await axios.put(
              apiUrl + "/customer/update/" + this.customerData.customerId,
              this.customerData
            );
          } catch (error) {
            console.log(error);
          }
        }
        await this.getCustomer();
        this.dialog = false;
      }
    },
    async editItem(id) {
      try {
        let result = await axios.get(apiUrl + "/customer/by-id/" + id);
        this.customerData = result.data;
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
        await axios.delete(apiUrl + "/customer/delete/" + this.deleteId);
      } catch (error) {
        console.log(error);
      }
      await this.getCustomer();
      this.dialogDelete = false;
    },
  },
};
</script>

<style></style>
