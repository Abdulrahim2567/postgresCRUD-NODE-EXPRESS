import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../components/HomePage.vue";
import dataTablesVue from "../components/dataTablesVue.vue";

const routes = [
    { path: '/', component: HomePage },
    { path: '/dataTablesVue', component: dataTablesVue, name: dataTablesVue }
]

export default createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes: routes })