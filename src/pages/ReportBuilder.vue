<template>
  <v-app id="report-builder">
    <v-navigation-drawer app clipped left permanent width="250">
      <elements-panel/>
    </v-navigation-drawer>

    <v-navigation-drawer app clipped right permanent width="350">
      <properties-panel/>
    </v-navigation-drawer>
    <div class="main-container">
      <div class="fixed-toolbar">
        <v-toolbar dense>
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="removeAllElements">
            <v-icon left>mdi-delete</v-icon>
            Xóa tất cả
          </v-btn>
          <v-btn text color="primary" @click="saveReport">
            <v-icon left>mdi-content-save</v-icon>
            Lưu
          </v-btn>
          <v-btn text color="primary" @click="previewReport">
            <v-icon left>mdi-eye</v-icon>
            Xem trước
          </v-btn>
          <v-btn text color="primary" @click="showJson">
            <v-icon left>mdi-code-json</v-icon>
            Show JSON
          </v-btn>
          <v-btn text color="primary" @click="exportXlsx">
            <v-icon left>mdi-microsoft-excel</v-icon>
            Xuất file XLS
          </v-btn>
        </v-toolbar>
      </div>
      <grid-layout
          :layout.sync="layout"
          :col-num="12"
          :row-height="25"
          :is-draggable="true"
          :is-resizable="true"
          :vertical-compact="false"
          :horizontal-compact="false"
          :margin="[10, 10]"
          use-css-transforms
          class="scrollable-grid-container"
      >
        <grid-item
            v-for="item in layout"
            :key="item.i"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            @resize="resizeEvent"
            @move="moveEvent"
            @click.native="selectElement(item.i)"
            class="report-element"
            :class="{ 'report-element--selected': item.i === selectedElementId }"
        >
          <component :is="getComponent(item.type)" :element="getElement(item.i)"></component>
        </grid-item>
      </grid-layout>
    </div>
  </v-app>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import {GridItem, GridLayout} from 'vue-grid-layout';

import ReportTitle from '@/components/report-elements/ReportTitle.vue';
import ReportText from '@/components/report-elements/ReportText.vue';
import ReportTable from '@/components/report-elements/ReportTable.vue';

import ElementsPanel from '@/components/sidebar/ElementsPanel.vue';
import PropertiesPanel from '@/components/sidebar/PropertiesPanel.vue';

export default {
  name: 'ReportBuilder',
  components: {
    GridLayout,
    GridItem,
    ReportTitle,
    ReportText,
    ReportTable,
    ElementsPanel,
    PropertiesPanel
  },
  computed: {
    ...mapState('report', ['layout', 'elements', 'selectedElementId']),
  },
  methods: {
    ...mapActions('report', ['updateLayout', 'selectElement', 'removeAllElements']),
    getComponent(type) {
      switch (type) {
        case 'title':
          return 'ReportTitle';
        case 'text':
          return 'ReportText';
        case 'table':
          return 'ReportTable';
        default:
          return null;
      }
    },
    getElement(id) {
      return this.elements.find(el => el.i === id);
    },
    resizeEvent(i, newH, newW) {
      this.updateLayout({i, changes: {w: newW, h: newH}});
    },
    moveEvent(i, newX, newY) {
      this.updateLayout({i, changes: {x: newX, y: newY}});
    },
    // Các phương thức mới cho v-bar
    saveReport() {
      // Logic để lưu báo cáo
      console.log('Báo cáo đã được lưu.');
    },
    previewReport() {
      // Logic để xem trước báo cáo
      console.log('Chuyển sang chế độ xem trước.');
    },
    showJson() {
      // Logic để hiển thị JSON của báo cáo
      console.log(JSON.stringify(this.elements, null, 2));
    },
    exportXlsx() {
      // Logic để xuất file XLSX
      console.log('Xuất file XLSX...');
    }
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.fixed-toolbar {
  flex-shrink: 0;
}

.scrollable-grid-container {
  flex-grow: 1;
  overflow: auto;
  position: relative; /* Thêm position relative cho scrollbar */
  background: lightgrey;
}
.report-element {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px;
  cursor: pointer;
  border: 2px solid transparent;
}

.report-element:hover {
  border-color: #1976D2;
}

.report-element--selected {
  border-color: #1976D2 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
