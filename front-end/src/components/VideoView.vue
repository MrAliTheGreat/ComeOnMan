<template>
    <div>
        <video autoplay playsinline :srcObject.prop="localStream"></video>
        <video v-for="remoteStream, index in remoteStreams" :key="index" autoplay playsinline :srcObject.prop="remoteStream"></video>
    </div>
</template>

<script>
export default {
    // In case of problems we should import adapter.js!
    name: "VideoView",
    data() {
        return {
            localStream: null,
            remoteStreams: [],
            peerConnection: new RTCPeerConnection(),
        }
    },
    methods: {

    },
    mounted() {
        this.$socket.on("ICE_CANDIDATE", (candidate) => {
            this.peerConnection.addIceCandidate(candidate)
        })
        this.$socket.on("OFFER", ({ offer, owner }) => {
            this.peerConnection.setRemoteDescription(offer).then(() => {
                this.peerConnection.createAnswer()
            })
            .then((answer) => {
                return this.peerConnection.setLocalDescription(answer)
            })
            .then(() => {
                this.$socket.emit("RTC_NEW_ANSWER", {
                    answer: this.peerConnection.localDescription,
                    receiver: owner,
                })
            })
        })
        this.$socket.on("ANSWER", (answer) => {
            this.peerConnection.setRemoteDescription(answer)
        })


        this.peerConnection.onicecandidate = (event) => {
            if(event.candidate) {
                this.$socket.emit("RTC_NEW_CANDIDATE", event.candidate)
            }
        }

        navigator.mediaDevices.getUserMedia({
            video: {
                width: {
                    max: 640
                },
                height: {
                    max: 480
                },
                frameRate: 15
            },
            audio: true
        })
        .then((stream) => {
            this.localStream = stream
            this.peerConnection.addStream(stream)
            return this.peerConnection.createOffer()
        })
        .then((offer) => {
            return this.peerConnection.setLocalDescription(offer)
        })
        .then(() => {
            this.$socket.emit("RTC_NEW_OFFER", {
                offer: this.peerConnection.localDescription,
                owner: this.$socket.id,
            })
        })

        this.peerConnection.ontrack = (event) => {
            if(!this.remoteStreams.includes(event.streams[0])){
                this.remoteStreams.push(event.streams[0])
            }
        }
    },
}
</script>

<style scoped>
video {
    border-radius: 20px;
    border: 10px solid red;
}

button {
    background-color: white;
}
</style>