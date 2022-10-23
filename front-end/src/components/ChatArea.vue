<template>
    <div>
        <input @input="onInput" @keyup.enter="onSubmit"/>
        <button @click="onSubmit"> Send! </button>
        <li v-for="{user, msg, time} in this.chat" :key="time + user + Math.random()">
            {{msg}} - {{time}} - {{user}}
        </li>
    </div>
</template>

<script>
import { io } from "socket.io-client"
import { serverVirtualIP, expressPort } from "../../../ConnectionConfig"

export default {
    name: "ChatArea",
    data() {
        return {
            message: "",
            chat: [],
            socket: io(`http://${serverVirtualIP}:${expressPort}/`)
        }
    },
    props: ["user"],
    methods: {
        onInput(event) {
            this.message = event.target.value
        },
        onSubmit() {
            this.socket.emit("SEND_MESSAGE", {
                user: this.user,
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

<style>
</style>