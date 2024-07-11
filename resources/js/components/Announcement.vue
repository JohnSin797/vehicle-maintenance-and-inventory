<template>
    <div class="p-5 space-y-5">
        <article class="ring ring-blue-400 p-5 rounded-lg" v-for="(ann_arr, index) in announcement_array" :key="index">
            <header class="">
                <p class="text-xl text-blue-600 font-bold">{{ ann_arr.title }}</p>
                <p class="text-sm text-cyan-400">{{ ann_arr.post_date }}</p>
            </header>
            <div class="mt-5 border border-slate-600 p-5 rounded-lg">
                <p>{{ ann_arr.message }}</p>
            </div>
        </article>
    </div>
</template>

<script>
export default {
    props: ['announcement_array']
}
</script>