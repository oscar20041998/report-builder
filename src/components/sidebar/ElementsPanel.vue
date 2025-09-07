<template>
  <div class="pa-3">
    <v-btn-group class="compact-btn-group" rounded>
      <v-tooltip
          v-for="item in reportElements"
          :key="item.type"
          location="top"
      >
        <template #activator="{ props }">
          <v-btn
              v-bind="props"
              icon
              variant="plain"
              class="white-btn"
              :aria-label="item.label"
              @click="addElement(item.type)"
          >
            <v-icon class="black-icon">{{ item.icon }}</v-icon>
          </v-btn>
        </template>

        <!-- tooltip content -->
        <span>{{ item.label }}</span>
      </v-tooltip>
    </v-btn-group>
  </div>
</template>


<script>
import { mapActions } from 'vuex';

export default {
  name: 'ElementsPanel',
  data() {
    return {
      reportElements: [
        { type: 'title', label: 'Tiêu đề', icon: 'mdi-format-title' },
        { type: 'text', label: 'Văn bản', icon: 'mdi-format-text' },
        { type: 'table', label: 'Bảng', icon: 'mdi-table-large' },
      ],
    };
  },
  methods: {
    ...mapActions('report', ['addElement']),
  },
};
</script>
<style scoped>
.compact-btn-group {
  gap: 6px; /* khoảng cách giữa các nút */
  align-items: center;
}

/* nút nền trắng, viền nhẹ, nhỏ gọn */
.white-btn {
  background: white !important;
  min-width: 40px;     /* vuông / nhỏ */
  height: 36px;
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.06);
}

/* hover hơi chuyển nền để có feedback */
.white-btn:hover {
  background: #fbfbfb !important;
}

/* icon màu đen rõ ràng */
.black-icon {
  color: #111 !important;
  font-size: 10px; /* chỉnh kích thước icon nếu muốn */
}

/* nếu cần nút rất nhỏ, giảm kích thước */
.compact-btn-group .white-btn.small {
  min-width: 34px;
  height: 32px;
  padding: 4px;
}
</style>
