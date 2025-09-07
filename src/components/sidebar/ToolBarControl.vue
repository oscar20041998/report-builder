<template>
  <div class="fixed-toolbar">
    <v-toolbar dense flat>
      <!-- Zoom selector -->
      <v-select
          :items="zoomOptions"
          v-model="zoomLevel"
          prepend-icon="mdi-magnify"
          dense
          hide-details
          @change="updateZoomLevel($event.value)"
          class="zoom-select"
      ></v-select>
      <v-spacer />
      <v-btn
          v-for="btn in toolbarButtons"
          :key="btn.label"
          text
          :color="btn.color"
          class="white--text"
          @click="btn.action"
      >
        <v-icon left>{{ btn.icon }}</v-icon>
      </v-btn>
    </v-toolbar>

  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: "ToolBarControl",
  computed: {
    ...mapState('report', ['elements']),
  },
  methods: {
    ...mapActions('report', ['updateLayout', 'selectElement', 'removeAllElements', 'updateZoomLevel']),
    saveReport() {
      console.log('Báo cáo đã được lưu.')
    },
    previewReport() {
      console.log('Chuyển sang chế độ xem trước.')
    },
    showJson() {
      console.log(JSON.stringify(this.elements, null, 2))
    },
    exportXlsx() {
      console.log('Xuất file XLSX...')
    }
  },
  data() {
    return {
      toolbarButtons: [
        { label: 'Xóa tất cả', icon: 'mdi-delete', color: 'error', action: () => this.removeAllElements() },
        { label: 'Lưu', icon: 'mdi-content-save', color: 'primary', action: () => this.saveReport() },
        { label: 'Xem trước', icon: 'mdi-eye', color: 'primary', action: () => this.previewReport() },
        { label: 'Show JSON', icon: 'mdi-code-json', color: 'primary', action: () => this.showJson() },
        { label: 'Xuất file XLS', icon: 'mdi-microsoft-excel', color: 'success', action: () => this.exportXlsx() }
      ],
      zoomLevel: 1.0, // Initial zoom level
      zoomOptions: [
        { text: '10%', value: 0.1 },
        { text: '20%', value: 0.2 },
        { text: '50%', value: 0.5 },
        { text: '80%', value: 0.8 },
        { text: '100%', value: 1.0 },
      ],
    }
  }
}
</script>

<style scoped>
.fixed-toolbar {
  position: sticky;     /* luôn dính trên */
  top: 0;               /* dính sát phía trên */
  z-index: 10;          /* nổi hơn grid bên dưới */
  background: #fff;     /* nền trắng, có thể đổi thành #fdfdfd hay #fafafa */
  border-bottom: 1px solid #ddd; /* đường viền dưới nhẹ nhàng */
}
.zoom-select {
  max-width: 120px;
}
</style>
