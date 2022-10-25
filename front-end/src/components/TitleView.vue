<template>
    <div :class="[isChat ? 'on-top-title' : 'title']">
        ComeO<span class="flicker-slow">nM</span><span class="flicker-fast">an!</span>
    </div>
</template>

<script>
export default {
    name: "TitleView",
    props: ["isChat"]
}
</script>

<style scoped>
.title {
    color: #FFFFFF;
    font-family: "SignPainter", sans-serif;
    font-size: 80px;
    text-shadow: 5px 0px 50px #888888;
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

.on-top-title {
    flex: 0;
    color: #FFFFFF;
    font-family: "SignPainter", sans-serif;
    text-shadow: 5px 0px 50px #888888;
    animation: moveToTop 4s forwards;
}

@keyframes moveToTop{
    0% {
        font-size: 80px;
    }
    100% {
        font-size: 40px;
    }
}
</style>