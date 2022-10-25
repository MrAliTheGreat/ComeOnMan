<template>
    <div class="main-div" >
        <img :src="user.avatar" />
        <textarea placeholder="What You Wanna Talk About..." @input="onInput" @keyup.enter.exact="onSubmit"></textarea>
        <button @click="onSubmit"> Send! </button>
    </div>
</template>

<script>
export default {
    name: "ChatInputView",
    data() {
        return {
            message: {},
        }
    },
    props: ["user"],
    methods:{
        onInput(event) {
            this.message.content = event.target.value
        },
        onSubmit(event){
            event.target.value = ""
            this.message.user = this.user
            this.message.time = new Date().toLocaleTimeString()
            this.$socket.emit("SEND_MESSAGE", this.message)
        }
    },     
}
</script>

<style scoped>
.main-div{
    display: flex;
    flex: 0;
    margin-bottom: 75px;
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
    margin-left: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 50%;
    font-family: 'SF Pro Display', sans-serif;
    font-weight: bold;
    font-size: 16px;
    background-color: #21B2FF;
    border: 2px solid #101010;
    box-shadow: 10px 0px 15px #000000;
}

button:active {
    background-color: #2186FF;
    transform: translateY(1px);
}

@media (max-width:850px) {
    .main-div {
        width: 100vw;
    }
}

@media (min-width:851px) {
    .main-div {
        width: 70vw;
    }
}
</style>