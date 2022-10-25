<template>
    <div style="display: flex;" :class="[isChat ? 'on-bottom' : '']" >
        <div class="dropdown">
            <Transition name="avatar-change" mode="out-in">
                <img :src="avatar" :key="avatar" />
            </Transition>
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
</template>

<script>
export default {
    name: "LoginInputView",
    data() {
        return {
            avatar: '/astronaut.png',
            username: ""
        }
    },
    props: [ "isChat" ],
    methods: {
        onInput(event) {
            this.username = event.target.value
        },
        onSubmit() {
            this.$emit("usernameSubmit", this.username)
            this.$emit("chat", true)
        },
        onImgSelect(event) {
            this.avatar = event.target.src
        }
    }
}
</script>

<style scoped>
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

button:active {
    background-color: #EEEEEE;
    transform: translateY(1px);
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
.on-bottom {
    flex: 0;
    margin-bottom: 1px;
}

.avatar-change-leave-to {
    opacity: 0;
}
.avatar-change-enter {
    opacity: 0;
    transform: translateX(-25px);
}

.avatar-change-enter-active,
.avatar-change-leave-active {
    transition: all 0.3s ease-out;
}
</style>