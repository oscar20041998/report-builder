import Vue from 'vue';
import Router from 'vue-router';
import ReportBuilder from '@/pages/ReportBuilder.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ReportBuilder',
      component: ReportBuilder,
    },
  ],
});