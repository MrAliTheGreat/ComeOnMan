<template>
    <div class="container">
        <ChatArea v-if="user" :user="user"></ChatArea>
        <LoginArea v-else @usernameSubmit="onUsernameSubmit"></LoginArea>
    </div>
</template>

<script>
import ChatArea from "./components/ChatArea.vue"
import LoginArea from "./components/LoginArea.vue"

export default {
    name: "App",
    data() {
        return {
            user: ""
        }
    },
    components: {
        ChatArea,
        LoginArea,
    },
    methods: {
        onUsernameSubmit(username) {
            this.user = username
        }
    }
}
</script>

<style>
</style>