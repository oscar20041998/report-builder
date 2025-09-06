<template>
  <div class="report-table-container">
    <div class="table-title-wrapper">
      <input
          v-model="title"
          class="table-title-input"
          @input="updateTitle"
          placeholder="Nhập tiêu đề bảng"
      />
    </div>
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
</template>

<script>
import { mapActions } from 'vuex';

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
  methods: {
    ...mapActions('report', [
      'updateCell',
      'updateElement',
      'updateTableHeaders',
      'removeColumn',
      'removeRow',
      'removeCell',
    ]),

    updateTitle() {
      this.updateElement({
        id: this.element.i,
        field: 'data',
        value: { ...this.element.data, title: this.title },
      });
    },

    updateHeader(colIndex, value) {
      const headers = [...this.element.data.headers];
      headers[colIndex].text = value;
      this.updateElement({
        id: this.element.i,
        field: 'data',
        value: { ...this.element.data, headers },
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
.report-table-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.table-title-wrapper {
  padding: 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}
.table-title-input {
  width: 100%;
  border: none;
  background-color: transparent;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 4px;
}
.report-table {
  width: 100%;
  border-collapse: collapse;
}
.report-table th,
.report-table td {
  border: 1px solid #ccc;
  padding: 8px;
  position: relative;
}
.report-table th {
  background: black;
  color: white;
  text-align: left;
}
.table-header-input,
.table-cell-input {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  background-color: white;
}
.table-header-input {
  color: white;
  background-color: transparent;
  border-color: transparent;
}
.table-header-input:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
}
.table-header-input:hover {
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
.table-cell-input {
  background-color: #fff;
}
.table-cell-input:focus {
  border-color: #2196f3;
  box-shadow: 0 0 5px rgba(33, 150, 243, 0.5);
}
.table-cell-input:hover {
  box-shadow: 0 0 5px rgba(33, 150, 243, 0.5);
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.add-column-cell,
.add-row-cell {
  width: 24px;
}
.close-btn {
  visibility: hidden;
  position: absolute;
  top: 50%;
  right: 4px;
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
  font-size: 16px !important;
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
}
.cell-remove-btn {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
}
.cell-remove-btn .v-icon {
  color: #f44336 !important;
}
</style>
