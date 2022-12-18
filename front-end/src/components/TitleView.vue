<template>
    <div class="main-div">
        <Transition @before-enter="beforeEnter" @after-enter="afterEnter">
            <div v-if="isChat || isVideo" style="flex: 1; display: flex; justify-content: flex-start; height: 65px;">
                <img src="/upload.png" @click="showUploadArea = !showUploadArea"/>
                <Transition name="slide">
                    <label v-if="showUploadArea" class="upload-area">
                        <span class="upload-area-text">
                            Click to select file or Drop your file here!
                        </span>
                        <input
                            type="file"
                            @change="onUpload"
                            @dragenter="onDragEnter"
                            @dragleave="onDragLeave"
                            @drop="onUpload"
                            style="position: absolute; height: 100%; width: 100%; top: 0px; left: 0px; cursor: pointer; opacity: 0;"
                        />
                    </label>
                </Transition>
            </div>
        </Transition>
        <div :class="[isChat || isVideo ? 'on-top-title' : 'title']">
            ComeO<span class="flicker-slow">nM</span><span class="flicker-fast">an!</span>
        </div>
        <Transition @before-enter="beforeEnter" @after-enter="afterEnter">
            <div v-if="isChat || isVideo" style="flex: 1; display: flex; justify-content: flex-end; height: 65px;">
                <img v-if="isChat" :src="isPeerLive ? '/video-call-live.png' : '/video-call.png'" @click="onVideoCall"/>
                <img v-if="isVideo && !hideVideo" src="/chat.png" @click="onHideVideo"/>
            </div>
        </Transition>
    </div>
</template>

<script>
export default {
    name: "TitleView",
    data() {
        return {
            showUploadArea: false,
        }
    },
    props: ["isChat", "isVideo", "hideVideo", "isPeerLive"],
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
            this.$socket.emit("LIVE", true)
            this.showUploadArea = false
        },
        onHideVideo() {
            this.$emit("hideVideo")
        },
        onUpload(event) {
            event.target.parentNode.className = "upload-area"
            this.$socket.emit("UPLOAD", { file: event.target.files[0], fileName: event.target.files[0].name } )
        },
        onDragEnter(event) {
            event.target.parentNode.className = "upload-area dragging"
        },
        onDragLeave(event) {
            event.target.parentNode.className = "upload-area"
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

.upload-area{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 65px;
    margin: 5px;
    height: 150px;
    width: 150px;
    background-color: #002B40;
    border-radius: 10px;
    transform-origin: top left;
    z-index: 1;
    border: 2px dashed white;
    transition: background-color 0.25s ease-in-out, border 0.25s ease-in-out;
}

.upload-area-text {
    font-family: 'SF Pro Display', sans-serif;
    font-weight: bold;
    color: white;
    font-size: 15px;
    text-align: center;
}

.upload-area:hover, .upload-area.dragging {
    background-color: #004B71;
    border: 2px solid white;
}

.slide-enter, .slide-leave-to {
    opacity: 0;
    transform: scale(0);
}

.slide-enter-active, .slide-leave-active{
    transition: all 1s ease;
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