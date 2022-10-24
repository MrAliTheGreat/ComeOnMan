<template>
    <div class="mainDiv">
        <div class="title">
            ComeO<span class="flicker-slow">nM</span><span class="flicker-fast">an!</span>
        </div>
        <div style="display: flex;">
            <div class="dropdown">
                <img :src="avatar" />
                <div class="dropdown-content">
                    <img 
                        class="choiceImg"
                        v-for="avatar in ['/mafia.png', '/man.png', '/astronaut.png', '/pirate.png']"
                        :key="avatar"
                        :src="avatar"
                        @click="onImgSelect"
                    />
                </div>
            </div>
            <input placeholder="What Should We Call You?" @input="onInput" @keyup.enter="onSubmit"/>
            <button @click="onSubmit"> Login! </button>
        </div>
    </div>        
</template>

<script>
export default {
    name: "LoginArea",
    data() {
        return {
            avatar: '/astronaut.png',
            username: ""
        }
    },
    methods: {
        onInput(event) {
            this.username = event.target.value
        },
        onSubmit() {
            this.$emit("usernameSubmit", this.username)
        },
        onImgSelect(event) {
            this.avatar = event.target.src
        }
    }
}
</script>

<style scoped>
.mainDiv {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: center;
    min-height: 80vh;
}

.title {
    color: #FFFFFF;
    font-family: "SignPainter", sans-serif;
    font-size: 80px;
    text-shadow: 5px 0px 50px #888888;
}

img {
    height: 50px;
    margin: 5px;
    border-radius: 50%;
}

input {
    padding: 2px;
    padding-left: 10px;
    padding-right: 10px;
    font-family: 'SF Pro Display', sans-serif;
    font-size: 16px;
    font-weight: bold;
    border: 1px solid #101010;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    box-shadow: 5px 0px 20px 3px #000000;
}

input:focus {
    outline: none;
}

button{
    padding: 2px;
    padding-left: 10px;
    padding-right: 10px;    
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    font-family: 'SF Pro Display', sans-serif;
    font-weight: bold;
    font-size: 16px;
    background-color: #FFFFFF;
    border: 1px solid #101010;
    border-left: 2px solid #101010;
    box-shadow: 10px 0px 15px #000000;
}

.dropdown {
  position: relative;
  display: inline-block;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #262626;
  min-width: 50px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 10px;
}

.dropdown:hover .dropdown-content, .dropdown:active .dropdown-content {
  display: block;
}

.choiceImg {
    cursor: pointer;
}
.choiceImg:hover {
    background-color: #606060;
}

.flicker-slow {
    animation: flicker 2.5s ease infinite;
}

.flicker-fast {
    animation: flicker 2s ease infinite;
}

@keyframes flicker {
    0%, 15%, 60%, 90%, 100% {
        opacity: 1;
    }
    16%, 61%, 91% {
        opacity: 0.5;
    }
}
</style>