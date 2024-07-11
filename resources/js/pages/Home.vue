<template>
    <div class="w-full">
        <div class="flex flex-col md:flex-row gap-5 w-full">
            <section class="p-5 w-full md:w-2/3 order-last md:order-first">
                <header class="p-2 border-b border-slate-900 sticky top-16 bg-white">
                    <p class="text-lg font-bold">Announcements</p>
                </header>
                <Announcement :announcement_array="this.announcement_array"></Announcement>
            </section>
            <section class="border border-slate-900 rounded-lg p-5 w-full md:w-1/3 md:min-w-80 space-y-4 md:sticky top-20 max-h-60">
                <header class="p-2 border-b border-slate-900 drop-shadow-md">
                    <p class="text-lg font-bold">Maintenance Schedule</p>
                </header>
                <Schedule :schedule_date="this.schedule_date" :schedule_day="this.schedule_day" :schedule_mon_year="this.schedule_mon_year" :message="this.message"></Schedule>
            </section>
        </div>
    </div>
</template>

<script>
import Schedule from '../components/Schedule.vue';
import Announcement from '../components/Announcement.vue';

export default {
    data() {
        return {
            date_string: '2024-07-08',
            schedule_date: '',
            schedule_day: '',
            schedule_mon_year: '',
            message: '',
            announcement_array: [
                { title: '1st post', post_date: '2024-04-01', message: 'test test' },
                { title: '2nd post', post_date: '2024-04-01', message: 'test test' },
                { title: '3rd post', post_date: '2024-04-01', message: 'test test' }
            ]
        }
    },
    components: {
        Schedule, Announcement
    },
    computed: {
        getSchedule() {
            if (this.date_string.length > 0) {
                const date = new Date(this.date_string)
                const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
                const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
                const year = date.getFullYear()
                const day = date.getDay()
                this.schedule_day = dayNames[day]
                this.schedule_mon_year = monthName + ' ' + year
                this.schedule_date = date.getDate()
            } else {
                this.message = 'No schedule for this month.'
            }
        }
    },
    mounted() {
        this.getSchedule
    },

}
</script>