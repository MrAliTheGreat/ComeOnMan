<template>
    <div :class="[isChat ? 'on-middle' : '']" >
        <div v-if="!chat.length" :class="[isChat ? 'greeting' : '']">
            Start Chatting Now...
        </div>
        <TransitionGroup v-else name="slide" :class="[isChat ? 'chat-wrapper' : '']">
            <div 
                v-for="{user, content, time} in chat"
                :key="time + user.name"
                :class="getMessageClassName(user.socketID)"
            >
                <div class="message" v-if="user.socketID === $socket.id" >
                    <div style="display: flex; flex-direction: column; flex: 1; justify-content: space-between ; margin-right: 20px;">
                        <span style="margin: 10px; word-break: break-word; white-space: pre-wrap;">{{content}}</span>
                        <span style="font-size: 10px; margin-bottom: 5px;">{{time}}</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <img :src="user.avatar"/>
                        <span class="username">{{user.name}}</span>
                    </div>
                </div>
                <div class="message" v-else>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <img :src="user.avatar"/>
                        <span class="username">{{user.name}}</span>
                    </div>                
                    <div style="display: flex; flex-direction: column; flex: 1; justify-content: space-between ; margin-left: 10px;">
                        <span style="margin: 10px; word-break: break-word; white-space: pre-wrap;">{{content}}</span>
                        <span style="font-size: 10px; margin-bottom: 5px; align-self: flex-end;">{{time}}</span>
                    </div>               
                </div>   
            </div>
        </TransitionGroup>
    </div>
</template>

<script>
export default {
    name: "ChatView",
    data() {
        return {
            chat: [],
        }
    },
    props: ["isChat"],
    methods : {
        getMessageClassName(id) {
            return id === this.$socket.id ? "own-wrapper" : "peer-wrapper"
        }
    },
    mounted(){ 
        this.$socket.on("NEW_MESSAGE", (data) => {
            this.chat.unshift(data)
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

.slide-move {
    transition: transform 0.5s ease;
}
.slide-enter-active {
    animation: slide 1s ease;
}

@keyframes slide {
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