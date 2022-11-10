<template>
    <div class="main-div" >
        <div v-if="isChat || isVideo" style="flex: 1;"> </div>
        <div :class="[isChat || isVideo ? 'on-top-title' : 'title']">
            ComeO<span class="flicker-slow">nM</span><span class="flicker-fast">an!</span>
        </div>
        <Transition @before-enter="beforeEnter" @after-enter="afterEnter">
            <div v-if="isChat || isVideo" style="flex: 1; display: flex; justify-content: flex-end; height: 65px;">
                <img v-if="isChat" src="/video-call.png" @click="onVideoCall"/>
                <img v-if="isVideo" src="/chat.png" @click="onChat"/>
            </div>
        </Transition>
    </div>
</template>

<script>
export default {
    name: "TitleView",
    props: ["isChat", "isVideo"],
    methods: {
        beforeEnter(el) {
            el.firstChild.style = "display: none"
        },
        afterEnter(el) {
            setTimeout(() => {
                el.firstChild.style = ""
                el.firstChild.className = "video-icon"
            }, 5000)
        },
        onVideoCall() {
            this.$emit("videoCallStart")
        },
        onChat() {
            this.$emit("chat", true)
        }
    }
}
</script>

<style scoped>
.main-div {
    display: flex;
    justify-content: center;
    align-items: center;
}

.title {
    color: #FFFFFF;
    font-family: "SignPainter HouseScript", sans-serif;
    font-size: 80px;
    text-shadow: 5px 0px 50px #888888;
    display: flex;
    align-items: center;
}

.on-top-title {
    flex: 0;
    color: #FFFFFF;
    font-family: "SignPainter HouseScript", sans-serif;
    text-shadow: 5px 0px 50px #888888;
    animation: moveToTop 4s forwards;
    display: flex;
    align-items: center;
}

.video-icon {
    height: 55px;
    margin: 5px;
    animation: fadeIn 0.75s ease;
}

.video-icon:hover {
    cursor: pointer;
}

.video-icon:active {
    opacity: 0.6;
    transform: translateY(1px);
}

.flicker-slow {
    animation: flicker 2.75s ease infinite;
}

.flicker-fast {
    animation: flicker 2s ease infinite;
}

@keyframes flicker {
    0%, 15%, 60%, 90%, 100% {
        opacity: 1;
    }
    16%, 61%, 91% {
        opacity: 0.4;
    }
}

@keyframes moveToTop{
    0% {
        font-size: 80px;
    }
    100% {
        font-size: 40px;
    }
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(35px);
    }
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