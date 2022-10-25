<template>
    <div class="container-fluid root-div">
        <TitleView :isChat="isChat"></TitleView>
        <ChatView v-if="username" :isChat="isChat" :username="username"></ChatView>
        <LoginInputView :isChat="isChat" @chat="onChat" @usernameSubmit="onUsernameSubmit"></LoginInputView>
    </div>
</template>

<script>
import TitleView from './components/TitleView.vue';
import LoginInputView from './components/LoginInputView.vue';
import ChatView from "./components/ChatView.vue"

export default {
    name: "App",
    data() {
        return {
            username: "",
            isChat: false
        }
    },
    components: {
        TitleView,
        LoginInputView,
        ChatView,
    },
    methods: {
        onUsernameSubmit(username) {
            this.username = username
        },
        onChat(chat) {
            this.isChat = this.username && chat
        }
    }
}
</script>

<style scoped>
.root-div {
    background-color: #101010;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
</style>