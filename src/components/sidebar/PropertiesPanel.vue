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
          :value="selectedElement.content"
          label="Nội dung"
          class="mb-3"
          @input="updateElement({ id: selectedElementId, field: 'content', content: $event })"
      ></v-text-field>

      <v-text-field
          v-if="selectedElement.type !== 'table'"
          :value="selectedElement.style.fontSize"
          label="Kích thước Font"
          type="number"
          :min="8"
          :max="72"
          @input="updateElementStyle({ id: selectedElementId, style: { fontSize: $event } })"
      ></v-text-field>

      <v-text-field
          v-if="selectedElement.type !== 'table'"
          :value="selectedElement.style.color"
          label="Màu chữ"
          type="color"
          @input="updateElementStyle({ id: selectedElementId, style: { color: $event } })"
      ></v-text-field>

      <!-- Các thuộc tính riêng của Bảng -->
      <div v-if="selectedElement.type === 'table'">
        <v-divider></v-divider>
        <v-subheader>Quản lý Bảng</v-subheader>
        <v-divider></v-divider>
        <!--        Style for border header-->
        <v-subheader>Đường viền Header</v-subheader>
        <v-btn-toggle
            multiple
            v-model="selectedBorders"
            dense
            color="primary"
            class="mb-4"
            @change="updateElementStyle({ id: selectedElementId, style: { headerBorder: $event } })"
        >
          <v-btn
              v-for="option in borderButtonOptions"
              :key="option.value"
              small
              :value="option.value"
          >
            <v-icon>{{ option.icon }}</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-divider></v-divider>
        <v-subheader>Kiểu đường viển Header</v-subheader>
        <v-select
            label="Kiểu đường viền"
            :items="borderStyleOptions"
            v-model="borderStyle"
            item-text="text"
            item-value="value"
            class="mb-4"
            @change="updateElementStyle({ id: selectedElementId, style: { headerBorder: $event }})"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>{{ item.icon }}</v-icon>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
        </v-select>
        <v-divider></v-divider>
        <!--        Style for border Data-->
        <v-subheader>Đường viền Data</v-subheader>
        <v-btn-toggle
            multiple
            v-model="selectedBorders"
            dense
            color="primary"
            class="mb-4"
            @change="updateElementStyle({ id: selectedElementId, style: { headerBorder: $event } })"
        >
          <v-btn
              v-for="option in borderButtonOptions"
              :key="option.value"
              small
              :value="option.value"
          >
            <v-icon>{{ option.icon }}</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-divider></v-divider>
        <v-subheader>Kiểu đường viển Data</v-subheader>
        <v-select
            label="Kiểu đường viền Data"
            :items="borderStyleOptions"
            v-model="borderStyle"
            item-text="text"
            item-value="value"
            class="mb-4"
            @change="updateElementStyle({ id: selectedElementId, style: { headerBorder: $event }})"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon left>{{ item.icon }}</v-icon>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
        </v-select>

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

      <v-btn-group>
        <v-btn color="error" @click="removeElement(selectedElementId)">
          <v-icon left>mdi-delete</v-icon>
          Xóa
        </v-btn>
        <v-btn color="primary" @click="cloneNewElement(selectedElementId)">
          <v-icon left>mdi-content-copy</v-icon>
          Copy
        </v-btn>
      </v-btn-group>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {
  name: 'PropertiesPanel',
  data() {
    return {
      borderStyle: 'solid',
      selectedBorders: [],
      borderStyleOptions: [
        {text: 'Đường liền', value: 'solid', icon: 'mdi-border-style-solid'},
        {text: 'Đường chấm', value: 'dotted', icon: 'mdi-border-style-dotted'},
        {text: 'Đường gạch ngang', value: 'dashed', icon: 'mdi-border-style-dashed'},
      ],
      borderButtonOptions: [
        {value: 'border-all', icon: 'mdi-border-all'},
        {value: 'border-top', icon: 'mdi-border-top'},
        {value: 'border-bottom', icon: 'mdi-border-bottom'},
        {value: 'border-left', icon: 'mdi-border-left'},
        {value: 'border-right', icon: 'mdi-border-right'},
      ],
    }
  },
  computed: {
    ...mapState('report', ['elements', 'selectedElementId']),
    selectedElement() {
      return this.elements.find(el => el.i === this.selectedElementId);
    },
  },
  methods: {
    ...mapActions('report', ['updateElement', 'updateElementStyle', 'removeElement', 'cloneNewElement']),
  },
};
</script>
