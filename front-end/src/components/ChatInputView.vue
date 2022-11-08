<template>
    <div class="main-div" >
        <img :src="user.avatar" />
        <textarea placeholder="What You Wanna Talk About..." @input="onInput" @keydown.enter.exact.prevent="onSubmit" ref="chatText"></textarea>
        <button @click="onSubmit"> Send! </button>
    </div>
</template>

<script>
export default {
    name: "ChatInputView",
    data() {
        return {
            message: {},
            hasEmitted: false,
        }
    },
    props: ["user"],
    methods:{
        onInput(event) {            
            this.message.content = event.target.value
            if(!this.hasEmitted){
                this.$socket.emit("TYPING", { ...this.user, doneTyping: false })
                this.hasEmitted = true
            }
            if(!this.message.content){
                this.$socket.emit("TYPING", { ...this.user, doneTyping: true })
                this.hasEmitted = false
            }            
        },
        onSubmit(){
            this.message.content = this.message.content.trim()
            if(this.message.content){
                this.$refs.chatText ? this.$refs.chatText.value = "" : null
                this.message.user = this.user
                this.message.time = new Date().toLocaleTimeString()
                this.$socket.emit("SEND_MESSAGE", this.message)
                this.$socket.emit("TYPING", { ...this.user, doneTyping: true })
                this.hasEmitted = false
                this.message.content = ""
            }
        }
    },    
}
</script>

<style scoped>
.main-div{
    display: flex;
    flex: 0;
    margin-bottom: 1px;
    margin-top: 10px;
}

img {
    height: 60px;
    margin: 5px;
    border-radius: 50%;
}

textarea {
    margin-bottom: 1px;
    padding: 10px;
    font-family: 'SF Pro Display', sans-serif;
    font-size: 16px;
    font-weight: bold;
    border: 1px solid #101010;
    border-radius: 10px;
    box-shadow: 5px 0px 20px 3px #000000;
    flex: 1;
    resize: none;
    max-height: 70px;
    scrollbar-width: none;
}

textarea:focus {
    outline: none;
}

button{
    margin: 1px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 50%;
    font-family: 'SF Pro Display', sans-serif;
    font-weight: bold;
    font-size: 16px;
    background-color: #FDFF61;
    border: 2px solid #101010;
    box-shadow: 10px 0px 15px #000000;
}

button:active {
    background-color: #ACAD42;
    transform: translateY(1px);
}

@media (max-width:850px) {
    .main-div {
        width: 100vw;
        /* margin-bottom: 80px; */
    }
}

@media (min-width:851px) {
    .main-div {
        width: 70vw;
    }
}
</style>