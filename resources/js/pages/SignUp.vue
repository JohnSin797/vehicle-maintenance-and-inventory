<template>
    <main class="absolute w-full h-full flex justify-center items-center">
        <section class="w-full md:w-2/3 p-6 border border-slate-900 rounded-lg">
            <p class="text-center text-xl font-bold">Vehicle Maintenance & Inventory</p>
            <p class="text-center text-blue-400 mb-5">Create your account</p>
            <form @submit.prevent="submitForm">
                <div class="flex flex-col md:flex-row gap-2">
                    <div class="w-full md:w-1/2 space-y-2 md:space-y-4">
                        <div class="group w-full p-2 border border-slate-900 rounded-lg focus-within:ring-2 ring-slate-900">
                            <label class="font-bold text-xs">First name:</label>
                            <input type="text" name="first_name" id="first_name" class="w-full p-2 rounded-lg outline-none" v-model="registerForm.first_name" required />
                        </div>
                        <div class="group w-full p-2 border border-slate-900 rounded-lg focus-within:ring-2 ring-slate-900">
                            <label class="font-bold text-xs">Last name:</label>
                            <input type="text" name="last_name" id="last_name" class="w-full p-2 rounded-lg outline-none" v-model="registerForm.last_name" required />
                        </div>
                        <div class="group w-full p-2 border border-slate-900 rounded-lg focus-within:ring-2 ring-slate-900">
                            <label class="font-bold text-xs">Email:</label>
                            <input type="text" name="email" id="email" class="w-full p-2 rounded-lg outline-none" v-model="registerForm.email" required />
                        </div>
                    </div>
                    <div class="w-full md:w-1/2 space-y-2">
                        <div class="group w-full p-2 border border-slate-900 rounded-lg focus-within:ring-2 ring-slate-900">
                            <label class="font-bold text-xs">Password:</label>
                            <input type="password" name="password" id="password" class="w-full p-2 rounded outline-none" v-model="registerForm.password" required />
                            <p class="text-xs">password strength</p>
                        </div>
                        <div class="group w-full p-2 border border-slate-900 rounded-lg focus-within:ring-2 ring-slate-900">
                            <label class="font-bold text-xs">Confirm password:</label>
                            <input type="password" name="password_confirmation" id="password_confirmation" class="w-full p-2 rounded outline-none" v-model="registerForm.password_confirmation" required />
                            <p class="text-xs">password match</p>
                        </div>
                        <button type="submit" class="w-full p-2 bg-blue-400 hover:bg-cyan-400 active:bg-slate-900 font-bold text-white rounded-lg">submit</button>
                        <div class="text-center p-2 font-bold text-xs space-x-2">
                            <span>Already have an account?</span>
                            <router-link to="/" class="text-blue-600 hover:text-cyan-400">Login</router-link>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    </main>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            registerForm: { first_name: '', last_name: '', email: '', password: '', password_confirmation: '' }
        }
    },
    methods: {
        submitForm() {
            axios.post('/user/register', this.registerForm)
            .catch(error=>{
                console.log(error.response.data.message)
            })
            .then(response=>{
                console.log(response.data.message)
            })
        }
    }
}
</script>