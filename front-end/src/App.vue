<template>
    <div class="root-div">
        <TitleView 
            :isChat="isChat"
            :isVideo="isVideo"
            :hideVideo="hideVideo"
            :isPeerLive="isPeerLive"
            :user="user"
            @videoCallStart="onVideoCallStart"
            @hideVideo="onHideVideo"
        />
        <ChatView 
            v-if="isChat || isVideo"
            @chat="onChat"
            @messageEdit="onMessageEdit"
            :isChat="isChat"
            :isVideo="isVideo"
            :hideVideo="hideVideo"
            :user="user"
        />
        <Transition name="fade" mode="out-in">
            <ChatInputView v-if="isChat && !isVideo || isChat && hideVideo" :user="user" :editMessage="editMessage" />
            <LoginInputView v-else-if="!isChat && !isVideo" 
                :isChat="isChat"
                :isVideo="isVideo"
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
            isChat: false,
            isVideo: false,
            hideVideo: false,
            isPeerLive: false,
            editMessage: {},
        }
    },
    components: {
        TitleView,
        LoginInputView,
        ChatView,
        ChatInputView,
    },
    methods: {
        onUserSubmit({ name, avatar, socketID }) {
            this.user.name = name
            this.user.avatar = avatar
            this.user.socketID = socketID
        },
        onChat(chat) {
            this.isChat = this.user.name && chat
            this.isVideo = false
        },
        onMessageEdit(msg) {
            this.editMessage = msg
        },
        onVideoCallStart() {
            this.isVideo = true
            this.isChat = false
            this.hideVideo = false
        },
        onHideVideo() {
            this.isChat = this.user.name
            this.hideVideo = true
        }
    },
    mounted() {
        this.$socket.on("PEER_LIVE", (peerStatus) => {
            this.isPeerLive = peerStatus
        })
    }
}
</script>

<style scoped>
.root-div {
    background-color: #101010;
    background-image: url('../public/background.png');
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