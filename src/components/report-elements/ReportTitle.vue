<template>
  <h1 :style="titleStyle">{{ element.content }}</h1>
</template>

<script>
export default {
  name: 'ReportTitle',
  props: {
    element: {
      type: Object,
      required: true,
      default: () => ({
        type: 'title',
        content: 'Report Title',
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#000000',
          textAlign: 'center'
        }
      })
    }
  },
  computed: {
    titleStyle() {
      // Áp dụng các style từ object element.style
      const { fontSize, fontWeight, color, textAlign } = this.element.style;
      return {
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        textAlign
      };
    }
  }
};
</script>

<style scoped>
/* Các style cục bộ cho component, tránh ảnh hưởng đến các phần khác */
h1 {
  margin: 0;
}
</style>