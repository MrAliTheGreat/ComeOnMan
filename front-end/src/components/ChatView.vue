<template>    
    <div class="on-middle">
        <VideoView v-if="isVideo"
            @chat="onChat"
            :style="hideVideo ? 'display: none;' : ''"
            :user="user"
            :peerMediaDetails="{starter: videoViewPeer, vidStatus: isVideoViewPeerVideoOff, micStatus: isVideoViewPeerAudioOff}"
            @resetVideoViewPeer="onResetVideoViewPeer"
        />
        <div v-if="isChat" class="on-middle">   
            <div v-if="!chat.length" class="greeting">
                Start Chatting Now...
                <input type="file" @change="onUpload"/>
            </div>
            <transition-group v-else name="slide" class="chat-wrapper" @before-leave="onBeforeLeave">
                <div 
                    v-for="{ user, content, time, type }, index in chat"
                    :key="time + content"
                    :class="getMessageClassName(user.socketID)"
                >
                    <div class="message" v-if="user.socketID === $socket.id"
                        @mousedown.right="onMessageDelete(index)"
                        @contextmenu.prevent="onMessageDelete(index)"
                        @click="onMessageEdit(index)"
                    >
                        <div class="own-msg-container">
                            <span class="msg-content">{{ content }}</span>
                            <span class="own-msg-time">{{ time }}&nbsp;&nbsp;{{type === "edit" ? "edited" : ""}}</span>
                        </div>
                        <div class="user-container">
                            <img :src="user.avatar"/>
                            <span class="username">{{ user.name }}</span>
                        </div>
                    </div>
                    <div class="message" v-else>
                        <div class="user-container">
                            <img :src="user.avatar"/>
                            <span class="username">{{ user.name }}</span>
                        </div>                
                        <div class="peer-msg-container">
                            <span class="msg-content">{{ content }}</span>
                            <span class="peer-msg-time">{{ time }}</span>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
        <span v-if="typing_peers.length && isChat" class="typing-msg">
            {{ typingMessage }}
        </span>
    </div>
</template>

<script>
import VideoView from './VideoView.vue';

export default {
    name: "ChatView",
    data() {
        return {
            chat: [],
            typing_peers: [],

            videoViewPeer: {},
            isVideoViewPeerVideoOff: false,
            isVideoViewPeerAudioOff: false,
        }
    },
    components: {
        VideoView,
    },
    props: [ "isChat", "isVideo", "hideVideo", "user" ],
    watch: {
        isVideo(newVal) {
            newVal ? this.typing_peers = [] : null
        }
    },
    methods: {
        getMessageClassName(id) {
            return id === this.$socket.id ? "own-wrapper" : "peer-wrapper"
        },
        onBeforeLeave(el) {
            const {marginLeft, marginTop, width, height} = window.getComputedStyle(el)
            el.style.left = `${el.offsetLeft - parseFloat(marginLeft, 10)}px`
            el.style.top = `${el.offsetTop - parseFloat(marginTop, 10)}px`
            el.style.width = width
            el.style.height = height
        },
        onMessageDelete(index) {
            this.$socket.emit("DELETE_MESSAGE", this.chat[index])
            this.chat.splice(index, 1)
        },
        onMessageEdit(index) {
            this.$emit("messageEdit", structuredClone(this.chat[index]))
        },
        onChat() {
            this.$emit("chat", true)
        },
        onResetVideoViewPeer() {
            this.videoViewPeer = {}
            this.isVideoViewPeerVideoOff = false
            this.isVideoViewPeerAudioOff = false
        },
        onUpload(event) {
            this.$socket.emit("UPLOAD", { file: event.target.files[0], fileName: event.target.files[0].name } )
        },
    },
    computed: {
        typingMessage() {
            if(!this.typing_peers.length) {
                return ""
            }
            if(this.typing_peers.length === 1) {
                return this.typing_peers[0].name + " is typing..."
            }
            return this.typing_peers.map(peer => peer.name).join(", ") + " are typing..."
        }
    },
    mounted(){ 
        this.$socket.on("NEW_MESSAGE", (data) => {
            if(data.type === "normal") {
                this.chat = [data, ...this.chat]
            }
            else if(data.type === "edit") {
                this.chat = this.chat.map((msg) => {
                    return (
                        msg.time === data.time &&
                        msg.user.name === data.user.name &&
                        msg.user.avatar === data.user.avatar &&
                        msg.user.socketID === data.user.socketID
                    ) ? data : msg
                })
            }
        })
        this.$socket.on("PEER_TYPING", (peer) => {
            if(peer.socketID !== this.$socket.id){
                if(peer.doneTyping){
                    this.typing_peers = this.typing_peers.filter(loopPeer => loopPeer.socketID !== peer.socketID )
                } else {
                    this.typing_peers = [...this.typing_peers, peer]
                }
            }
        })
        this.$socket.on("PEER_DELETE_MESSAGE", (data) => {
            this.chat = this.chat.filter((msg) => {
                return !(
                    msg.content === data.content &&
                    msg.time === data.time &&
                    msg.user.name === data.user.name &&
                    msg.user.avatar === data.user.avatar &&
                    msg.user.socketID === data.user.socketID
                )
            })
        })

        this.$socket.on("PEER_VIDEO_OFF", ({ peer, peerVideoStatus }) => {
            this.isVideoViewPeerVideoOff = peerVideoStatus
            this.videoViewPeer = peer
        })
        this.$socket.on("PEER_MIC_OFF", (peerMicStatus) => {
            this.isVideoViewPeerAudioOff = peerMicStatus
        })

        this.$socket.on("PEER_UPLOAD", ({ file, fileName }) => {
            const blob = new Blob([ file ])
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            URL.revokeObjectURL(link.href)
        })
    }
}
</script>

<style scoped>
img {
    height: 50px;
    margin: 5px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 50%;
}

.on-middle {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    overflow-y: scroll;
    scrollbar-width: none;
    animation: expandMiddle 4s forwards;
}

.chat-wrapper {
    display: flex;
    flex-direction: column-reverse;
    flex: 1;
    overflow-y: scroll;
    scrollbar-width: none;
    animation: expandChat 1.5s forwards;
}

.greeting {
    font-family: 'SF Pro Display', sans-serif;
    font-weight: bolder;    
    color: white;
    font-size: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow-y: scroll;
    scrollbar-width: none;
    animation: expandMiddleGreeting 5.5s forwards;
}

@keyframes expandMiddle{
    0% {
        flex: 0;
    }
    100% {
        flex: 1;
    }
}

@keyframes expandChat{
    0% {
        flex: 0;
        width: 80%;
    }
    100% {
        flex: 1;
        width: 100%;
    }
}

@keyframes expandMiddleGreeting{
    0% {
        flex: 0;
        opacity: 0;
        transform: scale(0.2);
    }
    100% {
        flex: 1;
    }
}

.own-wrapper {
    max-width: 65%;
    align-self: flex-end;
    margin: 10px;
    background-color: #7FFFCB;
    box-shadow: 0px 0px 10px #7FFFCB;
    border-radius: 15px;
    padding-left: 10px;
}

.peer-wrapper {
    max-width: 65%;
    align-self: flex-start;
    margin: 10px;
    background-color: #84F4FF;
    box-shadow: 0px 0px 10px #84F4FF;  
    border-radius: 15px;
    padding-right: 10px;
}

.message {
    display: flex;
    font-family: 'SF Pro Display', sans-serif;
    font-size: 20px;
}

.username {
    font-family: 'SF Pro Display', sans-serif;
    font-weight: bolder;
    font-size: 11px;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
    word-break: break-word;
    max-width: 85px;
    text-align: center;
}

.slide-enter-active {
    animation: slideIn 1s ease;
}

.slide-leave-active {
    animation: popout 0.5s ease;
    position: absolute;
}

.slide-move {
    transition: transform 0.5s;
}

.typing-msg {
    font-family: 'SF Pro Display', sans-serif;
    font-weight: bold;
    font-size: 14px;
    color: white;
    animation: popup 1s infinite;
}

.own-msg-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;
    margin-right: 20px;
}

.peer-msg-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between ;
    margin-left: 10px;
}

.msg-content {
    margin: 10px;
    word-break: break-word;
    white-space: pre-wrap;
}

.own-msg-time {
    font-size: 10px;
    margin-bottom: 5px;
}

.peer-msg-time {
    font-size: 10px;
    margin-bottom: 5px;
    align-self: flex-end;
}

.user-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

@keyframes popup{
    0% {
        opacity: 0.5;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.2);
    }
    100% {
        opacity: 0.5;
        transform: scale(1);
    }    
}

@keyframes popout{
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0);
    }    
}

@keyframes slideIn {
    0% {
        opacity: 0;
        transform: translateY(50px);
    }
    60% {
        transform: translateY(0px);
    }
    80% {
        opacity: 0.6;
        transform: translateY(5px);
    }    
}

@media (max-width:850px) {
    .on-middle {
        width: 100vw;
    }
}

@media (min-width:851px) {
    .on-middle {
        width: 70vw;
    }
}
</style>