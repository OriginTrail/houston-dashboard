import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: require('@/components/Account').default,
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/Login').default,
    },
    {
      path: '/import',
      name: 'import',
      component: require('@/components/Import').default,
    },
    {
      path: '/imports',
      name: 'imports',
      component: require('@/components/Imports').default,
    },
    {
      path: '/configuration',
      name: 'configuration',
      component: require('@/components/ConfigPage').default,
    },
    {
      path: '/account',
      name: 'account',
      component: require('@/components/Account').default,
    },
    {
      path: '/import-parent',
      name: 'import-parent',
      component: require('@/components/ImportParent').default,
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: require('@/components/JobsPage').default,
    },
    {
      path: '/odn-search',
      name: 'odn_search',
      component: require('@/components/ODNSearchPage').default,
    },
    {
      path: '/beta-support',
      name: 'beta-supp',
      component: require('@/components/BetaSupp').default,
    },
    {
      path: '*',
      redirect: '/',
    },

  ],
});
