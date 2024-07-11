<template>
    <div class="w-full p-5 rounded ring-2 ring-violet-600">
        <div class="text-center flex items-center gap-5 default-font">
            <div class="space-y-1">
                <p class="font-bold text-xs">{{ schedule_day }}</p>
                <div class="w-20 min-w-20 h-20 min-h-20 flex justify-center items-center rounded ring ring-blue-600">
                    <p class="text-4xl font-bold">{{ schedule_date }}</p>
                </div>
            </div>
            <div class="w-full text-center">
                <p class="text-violet-600 text-2xl font-bold">{{ schedule_mon_year }}</p>
                <p class="text-red-400 text-xl">{{ message }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['schedule_date', 'schedule_day', 'schedule_mon_year', 'message'],
    }
</script>