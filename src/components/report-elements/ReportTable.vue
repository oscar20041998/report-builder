<template>
  <div class="report-table-container">
    <div class="table-title-wrapper">
      <input
          v-model="title"
          class="table-title-input"
          @input="updateTitle"
          placeholder="Nhập tiêu đề bảng"
      />

      <v-btn-group class="ml-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                x-small
                color="primary"
                v-bind="attrs"
                v-on="on"
                :disabled="selectedElementId !== selectedElementId"
                @click="addRow(selectedElementId)"
            >
              <v-icon small>mdi-table-row-plus-after</v-icon>
            </v-btn>
          </template>
          <span>Thêm Hàng</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                x-small
                color="primary"
                v-bind="attrs"
                v-on="on"
                :disabled="selectedElementId!=selectedElementId"
                @click="addColumn(selectedElementId)"
            >
              <v-icon small>mdi-table-column-plus-after</v-icon>
            </v-btn>
          </template>
          <span>Thêm Cột</span>
        </v-tooltip>
      </v-btn-group>
    </div>

    <div class="table-container">
      <table class="report-table" :id="element.data.tableId">
        <thead>
        <tr :style="{ 'background-color': element.data.headerColor }">
          <th v-for="(header, colIndex) in element.data.headers" :key="colIndex">
            <div class="header-content">
              <input
                  v-model="header.text"
                  class="table-header-input"
                  @input="updateHeader(colIndex, $event.target.value)"
              />
              <v-btn
                  icon
                  x-small
                  @click="onRemoveColumn(colIndex)"
                  class="close-btn"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </th>
          <th class="add-column-cell"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in element.data.rows" :key="rowIndex">
          <td
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              :style="{
              'text-align': element.style.textAlignH,
              'vertical-align': element.style.textAlignV,
            }"
              class="table-cell-wrapper"
          >
            <input
                :value="cell.value"
                class="table-cell-input"
                @input="onUpdateCell(rowIndex, colIndex, $event.target.value)"
            />
            <v-btn
                icon
                x-small
                class="close-btn cell-remove-btn"
                @click="onRemoveCell(rowIndex, colIndex)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </td>
          <td class="add-row-cell">
            <v-btn
                icon
                x-small
                class="close-btn"
                @click="onRemoveRow(rowIndex)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {
  name: 'ReportTable',
  props: {
    element: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      title: this.element.data.title,
    };
  },
  computed: {
    ...mapState('report', ['elements', 'selectedElementId']),
    selectedElement() {
      return this.elements.find(el => el.i === this.selectedElementId);
    },
  },
  methods: {
    ...mapActions('report', [
      'updateCell',
      'updateElement',
      'updateTableHeaders',
      'addRow',
      'addColumn',
      'removeColumn',
      'removeRow',
      'removeCell',
    ]),

    updateTitle() {
      this.updateElement({
        id: this.element.i,
        field: 'data',
        value: {...this.element.data, title: this.title},
      });
    },

    updateHeader(colIndex, value) {
      const headers = [...this.element.data.headers];
      headers[colIndex].text = value;
      this.updateElement({
        id: this.element.i,
        field: 'data',
        value: {...this.element.data, headers},
      });
    },

    onRemoveColumn(colIndex) {
      this.removeColumn({
        tableId: this.element.i,
        colIndex,
      });
    },

    onRemoveRow(rowIndex) {
      this.removeRow({
        tableId: this.element.i,
        rowIndex,
      });
    },

    onRemoveCell(rowIndex, colIndex) {
      this.removeCell({
        tableId: this.element.i,
        rowIndex,
        colIndex,
      });
    },

    onUpdateCell(rowIndex, colIndex, value) {
      this.updateCell({
        tableId: this.element.i,
        rowIndex,
        colIndex,
        value,
      });
    },
  },
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  overflow-y: auto;
}

.report-table-container {
  max-width: 100%;
  height: 100%;
  overflow: auto;
  font-size: 10px; /* font-size chung cho toàn bộ table */
}

.table-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.table-title-input {
  flex: 1;
  border: none;
  background-color: transparent;
  font-size: 0.9rem;
  font-weight: bold;
  padding: 4px 6px;
  outline: none;
}


.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
}

.report-table th,
.report-table td {
  border: 1px solid #ccc;
  padding: 4px; /* giảm từ 8px -> 4px */
  max-width: 25px;
  max-height: 20px;
  min-width: 20px;
}

.report-table th {
  background: black;
  color: white;
  text-align: left;
  font-size: 10px;
}

.table-header-input,
.table-cell-input {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 2px 4px; /* nhỏ gọn lại */
  box-sizing: border-box;
  transition: all 0.2s ease;
  background-color: white;
  font-size: 10px;
  line-height: 1.2;
}

.table-header-input {
  color: white;
  background-color: transparent;
  border-color: transparent;
  font-weight: bold;
}

.table-header-input:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.table-header-input:hover {
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
}

.table-cell-input {
  background-color: #fff;
}

.table-cell-input:focus {
  border-color: #2196f3;
  box-shadow: 0 0 3px rgba(33, 150, 243, 0.5);
}

.table-cell-input:hover {
  box-shadow: 0 0 3px rgba(33, 150, 243, 0.5);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  font-size: 10px;
}

.add-column-cell,
.add-row-cell {
  width: 20px; /* thu nhỏ nút thêm */
}

.close-btn {
  visibility: hidden;
  position: absolute;
  top: 50%;
  right: 2px;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
}

th:hover .close-btn,
tr:hover .close-btn,
.table-cell-wrapper:hover .close-btn {
  visibility: visible;
}

.close-btn .v-icon {
  color: black !important;
  font-size: 12px !important;
}

.header-content .close-btn {
  background-color: transparent;
}

.header-content .close-btn .v-icon {
  color: white !important;
}

.header-content:hover .close-btn {
  background-color: white;
}

.header-content:hover .close-btn .v-icon {
  color: black !important;
}

.table-cell-wrapper {
  position: relative;
  font-size: 10px;
}

.cell-remove-btn {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  right: 2px;
  transform: translateY(-50%);
}

.cell-remove-btn .v-icon {
  color: #f44336 !important;
  font-size: 12px !important;
}
</style>
