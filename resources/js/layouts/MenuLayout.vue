<template>
    <main>
        <Transition name="slide-fade">
            <div v-if="menu" class="fixed top-0 left-0 w-full md:w-1/5 h-full bg-blue-400 text-white p-5 z-10">
                <ul class="flex flex-col md:justify-center gap-5">
                    <li><router-link to="/home" :class="{'active-link' : isActive('/home')}" class="w-full block p-2 rounded hover:bg-indigo-900">Home</router-link></li>
                    <li><router-link to="/maintenance" :class="{'active-link' : isActive('/maintenance')}" class="w-full block p-2 rounded hover:bg-indigo-900">Maintenance</router-link></li>
                    <li><router-link to="/inventory" :class="{'active-link' : isActive('/inventory')}" class="w-full block p-2 rounded hover:bg-indigo-900">Inventory</router-link></li>
                </ul>
                <div class="space-y-20">
                    <button class="text-xs text-gray-200 hover:text-white w-full md:hidden" @click="logout">logout</button>
                    <button class="md:hidden w-full" @click="onChangeMenu">close</button>
                </div>
            </div>
            <div v-else class="fixed top-0 left-0 w-full md:w-1/5 md:h-full bg-blue-400 text-white p-5 z-10">
                <ul class="flex-col gap-5 hidden flex">
                    <li><router-link to="/home" :class="{'active-link' : isActive('/home')}">Home</router-link></li>
                    <li><router-link to="/maintenance" :class="{'active-link' : isActive('/maintenance')}">Maintenance</router-link></li>
                    <li><router-link to="/inventory" :class="{'active-link' : isActive('/inventory')}">Inventory</router-link></li>
                </ul>
                <div class="">
                    <button class="text-xs text-gray-200 hover:text-white w-full hidden md:block" @click="logout">logout</button>
                    <button class="md:hidden" @click="onChangeMenu">close</button>
                </div>
            </div>
        </Transition>
        <div class="hidden md:flex justify-between fixed top-0 right-0 p-5 bg-blue-600 text-white z-10 w-4/5">
            <p>{{ this.full_name }}</p>
            <button class="text-xs text-gray-200 hover:text-white" @click="logout">logout</button>
        </div>
        <div class="pt-20 px-10 absolute right-0 top-0 w-full md:w-4/5 z-2">
            <slot></slot>
        </div>
    </main>
</template>

<script>
import axios from "axios"
import Navigation from "../components/Navigation.vue"

export default {
    data() {
        return {
            menu: true,
            full_name: ''
        }
    },
    components: {
        Navigation
    },
    methods: {
        isActive(link) {
            return this.$route.path.startsWith(link)
        },
        logout() {
            localStorage.removeItem('VMaI-token')
            this.$router.push('/')
        },
        onChangeMenu() {
            this.menu = !this.menu
        },
        
    },
    computed: {
        getFullName() {
            const token = localStorage.getItem('VMaI-token')
            axios.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response=>{
                console.log(token, response)
                this.full_name = response.data.first_name + ' ' + response.data.last_name
                console.log(this.full_name)
            })
            .catch(error=>{
                console.log(error)
            })
        }
    },
    mounted() {
        this.getFullName
    },
}
</script>

<style>
.active-link {
    font-weight: bold;
    background-color: black;
}
.slide-fade-enter-active {
  transition: all 1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>