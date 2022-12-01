import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../components/HomePage.vue";
import dataTablesVue from "../components/dataTablesVue.vue";
import itemNew from "../components/itemNew.vue";
import importSingle from "../components/importSingle.vue";
import importBatch from "../components/importBatch.vue";

const routes = [
    { path: '/', component: HomePage },
    { path: '/dataTablesVue', component: dataTablesVue, name: dataTablesVue },
    { path: '/itemNew', component: itemNew, name: itemNew },
    { path: '/importSingle', component: importSingle, name: importSingle },
    { path: '/importBatch', component: importBatch, name: importBatch },
]

export default createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes: routes })