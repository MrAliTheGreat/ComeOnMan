<template>
    <div class="container-fluid root-div">
        <TitleView :isChat="isChat" />
        <ChatView v-if="isChat" :isChat="isChat"/>
        <Transition name="fade" mode="out-in">
            <ChatInputView v-if="isChat" :user="user" />
            <LoginInputView v-else 
                :isChat="isChat"
                @chat="onChat"
                @userSubmit="onUserSubmit"
            />
        </Transition>
    </div>
</template>

<script>
import TitleView from './components/TitleView.vue';
import LoginInputView from './components/LoginInputView.vue';
import ChatInputView from './components/ChatInputView.vue';
import ChatView from "./components/ChatView.vue"

export default {
    name: "App",
    data() {
        return {
            user: {},
            isChat: false
        }
    },
    components: {
        TitleView,
        LoginInputView,
        ChatView,
        ChatInputView,
    },
    methods: {
        onUserSubmit({ name, avatar }) {
            this.user.name = name
            this.user.avatar = avatar
        },
        onChat(chat) {
            this.isChat = this.user.name && chat
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
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade-enter-active, .fade-leave-active{
    transition: all 2s ease;
}
</style>