<template>
    <div>
        <input @input="onInput" @keyup.enter="onSubmit"/>
        <button @click="onSubmit"> Login! </button>
    </div>
</template>

<script>
export default {
    name: "LoginArea",
    data() {
        return {
            username: ""
        }
    },
    methods: {
        onInput(event) {
            this.username = event.target.value
        },
        onSubmit() {
            this.$emit("usernameSubmit", this.username)
        }
    }
}
</script>

<style>

</style>