<template>
  <div class="pa-3">
    <v-toolbar flat dense>
      <v-toolbar-title>Bảng Thuộc tính</v-toolbar-title>
    </v-toolbar>
    <div v-if="!selectedElement">
      <p class="text-xs-center grey--text">Tùy chỉnh thuộc tính</p>
    </div>
    <div v-else>
      <!-- Các thuộc tính chung -->
      <v-text-field
          v-if="selectedElement.type !== 'table'"
          v-model="selectedElement.content"
          label="Nội dung"
          class="mb-3"
          @input="updateElement({ id: selectedElementId, field: 'content', value: $event })"
      ></v-text-field>

      <v-text-field
          v-if="selectedElement.type !== 'table'"
          v-model.number="selectedElement.style.fontSize"
          label="Kích thước Font"
          type="number"
          :min="8"
          :max="72"
          @input="updateElement({ id: selectedElementId, field: 'style', value: { fontSize: $event } })"
      ></v-text-field>

      <v-text-field
          v-if="selectedElement.type !== 'table'"
          v-model="selectedElement.style.color"
          label="Màu chữ"
          type="color"
          @input="updateElement({ id: selectedElementId, field: 'style', value: { color: $event } })"
      ></v-text-field>

      <!-- Các thuộc tính riêng của Bảng -->
      <div v-if="selectedElement.type === 'table'">
        <v-divider></v-divider>
        <v-subheader>Quản lý Bảng</v-subheader>
        <v-btn block color="primary" class="mb-3" @click="addRow(selectedElementId)">Thêm Hàng</v-btn>
        <v-btn block color="primary" class="mb-3" @click="addColumn(selectedElementId)">Thêm Cột</v-btn>

        <v-divider></v-divider>
        <v-subheader>Căn lề</v-subheader>
        <v-select
            label="Căn lề ngang"
            :items="['left', 'center', 'right']"
            v-model="selectedElement.style.textAlignH"
            @change="updateElementStyle({ id: selectedElementId, style: { textAlignH: $event } })"
        ></v-select>
        <v-select
            label="Căn lề dọc"
            :items="['top', 'middle', 'bottom']"
            v-model="selectedElement.style.textAlignV"
            @change="updateElementStyle({ id: selectedElementId, style: { textAlignV: $event } })"
        ></v-select>
      </div>

      <v-btn color="error" @click="removeElement(selectedElementId)">
        <v-icon left>mdi-delete</v-icon> Xóa
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'PropertiesPanel',
  data(){
    return {
      thresholdKeyList: [
        {
          id: '1',
          thresholdKey: "th_strInvAmnt",
          type: "warning",
          upperLimit: '0',
          lowerLimit: '10'
        },
        {
          id: '2',
          thresholdKey: "th_strInvAmntRatio",
          type: "warning",
          upperLimit: '0',
          lowerLimit: '-15'
        }
      ]
    }
  },
  computed: {
    ...mapState('report', ['elements', 'selectedElementId']),
    selectedElement() {
      return this.elements.find(el => el.i === this.selectedElementId);
    },
  },
  methods: {
    ...mapActions('report', ['updateElement', 'updateElementStyle','removeElement', 'addColumn', 'addRow']),
  },
};
</script>
