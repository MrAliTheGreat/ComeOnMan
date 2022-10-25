<template>
    <div :class="[isChat ? 'on-middle' : '']">
        <div 
            v-for="{user, content, time} in chat" :key="time + user.name"
            :class="getMessageClassName(user.socketID)"
        >
            <div class="message" v-if="user.socketID === $socket.id">
                <div style="display: flex; flex-direction: column; flex: 1; margin-right: 20px;">
                    <span style="margin: 10px; word-break: break-word;">{{content}}</span>
                    <span style="font-size: 10px">{{time}}</span>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img :src="user.avatar"/>
                    <span class="username">{{user.name}}</span>
                </div>
            </div>
            <div class="message" v-else>
                <img :src="user.avatar"/>
                <div style="display: flex; flex-direction: column; flex: 1; margin-right: 20px;">
                    <span style="margin-bottom: 10px; word-break: break-word;">{{content}}</span>
                    <span style="font-size: 10px">{{time}}</span>
                </div>                
            </div>            
        </div>
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
            this.chat.push(data)            
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
    flex: 1;
    overflow: scroll;
    scrollbar-width: none;
    animation: expandMiddle 4s forwards;
}

@keyframes expandMiddle{
    0% {
        flex: 0;
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
}

.peer-wrapper {
    max-width: 65%;
    align-self: flex-start;
    margin: 10px;
}

.message {
    display: flex;
    align-items: center;
    font-family: 'SF Pro Display', sans-serif;
    font-size: 20px;
    padding-left: 10px;
}

.username {
    font-family: 'SF Pro Display', sans-serif;
    font-weight: bolder;
    font-size: 12px;
    margin: 5px;
    margin-left: 10px;
    margin-right: 10px;
    word-break: break-word;
    max-width: 50px;
    text-align: center;
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