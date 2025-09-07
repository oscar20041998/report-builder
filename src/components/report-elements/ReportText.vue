<template>
  <span :style="textStyle">{{ element.content }}</span>
</template>

<script>
export default {
  name: 'ReportText',
  props: {
    element: {
      type: Object,
      required: true,
      default: () => ({
        type: 'text',
        content: 'This is a normal text block.',
        style: {
          fontSize: 10,
          color: '#333333',
          textAlign: 'left'
        }
      })
    }
  },
  computed: {
    textStyle() {
      const { fontSize, color, textAlign } = this.element.style;
      return {
        fontSize: `${fontSize}px`,
        color,
        textAlign
      };
    }
  }
};
</script>

<style scoped>
/* Các style cục bộ cho component */
p {
  margin: 0;
  line-height: 1.5;
}
</style>