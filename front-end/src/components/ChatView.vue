<template>
    <div :class="[isChat ? 'on-middle' : '']">
        <input @input="onInput" @keyup.enter="onSubmit"/>
        <button @click="onSubmit"> Send! </button>
        <li v-for="{username, msg, time} in this.chat" :key="time + username + Math.random()">
            {{msg}} - {{time}} - {{username}}
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
            message: "",
            chat: [],
            socket: io(`http://${serverVirtualIP}:${expressPort}/`)
        }
    },
    props: ["username", "isChat"],
    methods: {
        onInput(event) {
            this.message = event.target.value
        },
        onSubmit() {
            this.socket.emit("SEND_MESSAGE", {
                username: this.username,
                msg: this.message,
                time: new Date().toLocaleTimeString()                
            })
        }
    },
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