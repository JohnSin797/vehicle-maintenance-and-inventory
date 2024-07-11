<template>
    <div>
        <template v-if="showLayout">
            <MenuLayout>
                <router-view></router-view>
            </MenuLayout>
        </template>
        <template v-else>
            <router-view></router-view>
        </template>
    </div>
</template>

<script>
    import MenuLayout from './layouts/MenuLayout.vue'

    export default {
        name: "App",
        components: {
            MenuLayout
        },
        computed: {
            showLayout() {
                return this.$route.meta.Layout
            }
        },
    }
</script>