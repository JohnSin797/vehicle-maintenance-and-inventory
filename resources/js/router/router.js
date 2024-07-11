import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import PageNotFound from "../pages/NotFound.vue"
import SignUp from "../pages/SignUp.vue";
import Home from "../pages/Home.vue";
import Maintenance from "../pages/Maintenance.vue";
import Inventory from "../pages/Inventory.vue";

const routes = [
    {
        name: 'login',
        path: '/',
        component: Login,
        meta: { Layout: false, requiresAuth: false }
    },
    {
        path: '/:pathMatch(.*)*',
        component: PageNotFound,
        meta: { Layout: false, requiresAuth: false }
    },
    {
        name: 'register',
        path: '/sign-up',
        component: SignUp,
        meta: { Layout: false, requiresAuth: false }
    },
    {
        name: 'home',
        path: '/home',
        component: Home,
        meta: { Layout: true, requiresAuth: true }
    },
    {
        name: 'maintenance',
        path: '/maintenance',
        component: Maintenance,
        meta: { Layout: true, requiresAuth: true }
    },
    {
        name: 'inventory',
        path: '/inventory',
        component: Inventory,
        meta: { Layout: true, requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth))
    {
        if(!isAuthenticated())
        {
            next('/')
        }
        else
        {
            next()
        }
    }
    else {
        if(isAuthenticated()) 
        {
            next('/home')
        }
        else
        {
            next()
        }
    }
})

function isAuthenticated() {
    return localStorage.getItem('VMaI-token') !== null;
}

export default router;