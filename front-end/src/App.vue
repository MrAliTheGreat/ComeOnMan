<template>
    <div class="root-div">
        <TitleView :isChat="isChat"/>
        <ChatView v-if="isChat" @messageEdit="onMessageEdit" />
        <Transition name="fade" mode="out-in">
            <ChatInputView v-if="isChat" :user="user" :editMessage="editMessage" />
            <LoginInputView v-else 
                :isChat="isChat"
                @chat="onChat"
                @userSubmit="onUserSubmit"
            />
        </Transition>
        <VideoView v-if="isVideo" />
    </div>
</template>

<script>
import TitleView from './components/TitleView.vue';
import LoginInputView from './components/LoginInputView.vue';
import ChatInputView from './components/ChatInputView.vue';
import ChatView from "./components/ChatView.vue"
import VideoView from './components/VideoView.vue';

export default {
    name: "App",
    data() {
        return {
            user: {},
            isChat: false,
            isVideo: false,
            editMessage: {},
        }
    },
    components: {
        TitleView,
        LoginInputView,
        ChatView,
        ChatInputView,
        VideoView,
    },
    methods: {
        onUserSubmit({ name, avatar, socketID }) {
            this.user.name = name
            this.user.avatar = avatar
            this.user.socketID = socketID
        },
        onChat(chat) {
            this.isChat = this.user.name && chat
        },
        onMessageEdit(msg) {
            this.editMessage = msg
        },
    }
}
</script>

<style scoped>
.root-div {
    background-color: #101010;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade-enter-active, .fade-leave-active{
    transition: all 1s ease;
}
</style>