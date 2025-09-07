<template>
  <v-app id="report-builder">
    <!-- Sidebar trái -->
    <v-navigation-drawer app clipped left permanent width="60">
      <elements-panel/>
    </v-navigation-drawer>
    <ToolBarControl/>

<!--     Sidebar phải-->
    <v-navigation-drawer app right width="300">
      <!-- nút toggle -->
      <v-btn icon @click="showProperties = !showProperties" class="toggle-properties-btn">
        <v-icon>{{ showProperties ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
      </v-btn>
      <properties-panel/>
    </v-navigation-drawer>

    <!-- Grid Layout (scrollable) -->
    <div class="grid-wrapper scrollable-grid-container">
      <grid-layout
          :layout.sync="layout"
          :col-num="1000000"
          :row-height="25"
          :is-draggable="true"
          :is-resizable="true"
          :vertical-compact="false"
          :horizontal-compact="false"
          :margin="[10, 10]"
          use-css-transforms
      >
        <grid-item
            v-for="item in layout"
            v-bind="item"
            :key="item.i"
            @resize="(i,h,w) => updateItem(i,{h,w})"
            @move="(i,x,y) => updateItem(i,{x,y})"
            @click.native="selectElement(item.i)"
            class="report-element scrollable-item"
            :class="{ 'report-element--selected': item.i === selectedElementId }"
        >
          <component :is="componentMap[item.type]" :element="getElement(item.i)"/>
        </grid-item>
      </grid-layout>
    </div>
  </v-app>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import {GridItem, GridLayout} from 'vue-grid-layout'

import ReportTitle from '@/components/report-elements/ReportTitle.vue'
import ReportText from '@/components/report-elements/ReportText.vue'
import ReportTable from '@/components/report-elements/ReportTable.vue'

import ElementsPanel from '@/components/sidebar/ElementsPanel.vue'
import PropertiesPanel from '@/components/sidebar/PropertiesPanel.vue'
import ToolBarControl from "@/components/sidebar/ToolBarControl.vue";

export default {
  name: 'ReportBuilder',
  components: {
    ToolBarControl,
    GridLayout,
    GridItem,
    ReportTitle,
    ReportText,
    ReportTable,
    ElementsPanel,
    PropertiesPanel
  },
  computed: {
    ...mapState('report', ['layout', 'elements', 'selectedElementId', 'zoomLevel'])
  },
  data() {
    return {
      componentMap: {
        title: 'ReportTitle',
        text: 'ReportText',
        table: 'ReportTable'
      },
      showProperties: true, // mặc định mở
      toolbarButtons: [
        {label: 'Xóa tất cả', icon: 'mdi-delete', color: 'error', action: () => this.removeAllElements()},
        {label: 'Lưu', icon: 'mdi-content-save', color: 'primary', action: () => this.saveReport()},
        {label: 'Xem trước', icon: 'mdi-eye', color: 'primary', action: () => this.previewReport()},
        {label: 'Show JSON', icon: 'mdi-code-json', color: 'primary', action: () => this.showJson()},
        {label: 'Xuất file XLS', icon: 'mdi-microsoft-excel', color: 'primary', action: () => this.exportXlsx()}
      ]
    }
  },
  methods: {
    ...mapActions('report', ['updateLayout', 'selectElement', 'removeAllElements']),
    getElement(id) {
      return this.elements.find(el => el.i === id)
    },
    updateItem(i, changes) {
      this.updateLayout({i, changes})
    },
    scaledLayout() {
      return this.layout.map(item => ({
        ...item,
        x: item.x * this.zoomLevel,
        y: item.y * this.zoomLevel,
        w: item.w * this.zoomLevel,
        h: item.h * this.zoomLevel,
      }));
    },
    scaledColNum() {
      return Math.floor(12 / this.zoomLevel);
    },
    scaledRowHeight() {
      return 30 * this.zoomLevel;
    },
    canvasWrapperStyle() {
      return {
        transform: `scale(${this.zoomLevel})`,
        transformOrigin: 'top left',
        width: `${100 / this.zoomLevel}%`,
        height: `${100 / this.zoomLevel}%`,
      };
    },
  }
}
</script>

<style scoped>
.scrollable-grid-container {
  width: 100vw; /* chiếm toàn bộ chiều rộng màn hình */
  height: 100vh; /* chiếm toàn bộ chiều cao màn hình */
  overflow-x: auto; /* bật scroll ngang */
  overflow-y: auto; /* bật scroll dọc */
  box-sizing: border-box; /* tránh tràn do padding/border */
  background: #cccccc;
}

.report-element {
  background: #fff;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  overflow-y: auto;
  max-height: 100%;
}

.report-element:hover {
  border-color: #1976d2;
}

.report-element--selected {
  border-color: #1976d2 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.scrollable-item {
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
}

.toggle-properties-btn {
  position: absolute;
  top: 70px;   /* dưới AppBar */
  right: 360px; /* sát cạnh drawer */
  z-index: 999;
}
</style>
