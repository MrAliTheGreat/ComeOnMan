<template>
    <div :class="[isChat ? 'on-middle' : '']">
        <li v-for="{user, content, time} in this.chat" :key="time + user.name" style="color:white">
            {{content}} - {{time}} - {{user}}
        </li>
    </div>
</template>

<script>
import { io } from "socket.io-client"
import { serverVirtualIP, expressPort } from "../../../ConnectionConfig"

export default {
    name: "ChatView",
    data() {
        return {
            chat: [],
            socket: io(`http://${serverVirtualIP}:${expressPort}/`)
        }
    },
    props: ["isChat"],
    mounted(){ 
        this.socket.on("NEW_MESSAGE", (data) => {
            this.chat.push(data)            
        })
    }    
}
</script>

<style scoped>
.on-middle {
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
</style>