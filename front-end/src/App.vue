<template>
    <div class="container-fluid">
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

<style scoped>
div {
    background-color: #151515;
    display: flex;
    justify-content: center;
}
</style>