<template>
    <main class="absolute w-full h-full flex justify-center items-center">
        <section class="w-full md:w-1/3 p-6 border border-slate-900 rounded-lg">
            <p class="text-center text-xl font-bold">Vehicle Maintenance & Inventory</p>
            <p class="text-center text-blue-400 mb-5">Login your account</p>
            <form @submit.prevent="submitForm" class="space-y-2">
                <div class="group w-full p-2 border border-slate-900 rounded-lg focus-within:ring-2 ring-slate-900">
                    <label class="font-bold text-xs">Email:</label>
                    <input type="text" name="email" id="email" class="w-full p-2 rounded-lg outline-none" v-model="loginForm.email" required/>
                </div>
                <div class="group w-full p-2 border border-slate-900 rounded-lg focus-within:ring-2 ring-slate-900">
                    <label class="font-bold text-xs">Password:</label>
                    <input type="password" name="password" id="password" class="w-full p-2 rounded outline-none" v-model="loginForm.password" required/>
                </div>
                <button type="submit" class="w-full p-2 bg-blue-400 hover:bg-cyan-400 active:bg-slate-900 font-bold text-white rounded-lg">login</button>
                <div class="text-center p-2 font-bold text-xs space-x-2">
                    <span>Create new account?</span>
                    <router-link to="/sign-up" class="text-blue-600 hover:text-cyan-400">Sign up</router-link>
                </div>
            </form>
        </section>
    </main>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            loginForm: { email: '', password: '' }
        }
    },
    methods: {
        submitForm() {
            axios.post('/user/login', this.loginForm)
            .catch(error=>{
                console.log(error.response.data.message)
                Swal.fire({
                    title: 'Login Failed',
                    text: error.response.data.message,
                    icon: 'error',
                    showConfirmButton: true
                })
            })
            .then(response=>{
                const token = response.data.token
                console.log(token)
                localStorage.setItem('VMaI-token', token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                this.$router.push('/home')
            })
        }
    }
}
</script>