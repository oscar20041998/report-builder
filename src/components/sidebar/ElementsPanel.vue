<template>
  <div class="pa-3">
    <v-btn
        v-for="item in reportElements"
        :key="item.type"
        block
        class="mb-3"
        color="light"
        @click="addElement(item.type)"
    >
      <v-icon left>{{ item.icon }}</v-icon>
      {{ item.label }}
    </v-btn>
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
