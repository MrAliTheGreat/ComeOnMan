<template>
    <div>
        <video autoplay playsinline muted :srcObject.prop="localStream"></video>
        <video v-for="remoteStream, index in remoteStreams" :key="index" autoplay playsinline :srcObject.prop="remoteStream"></video>
    </div>
</template>

<script>
import "webrtc-adapter"

export default {
    // In case of problems we should import adapter.js!
    name: "VideoView",
    data() {
        return {
            localStream: null,
            remoteStreams: [],
            peerConnection: new RTCPeerConnection(
                {
                    'iceServers': [
                        {
                            'urls': 'stun:stun.l.google.com:19302'
                        },
                        {
                            'urls': 'turn:192.158.29.39:3478?transport=udp',
                            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                            'username': '28224511:1379330808'
                        },
                    ]
                }                
            ),
        }
    },
    methods: {

    },
    mounted() {
        this.$socket.on("ICE_CANDIDATE", (candidate) => {
            console.log("RECEIVED - ICE")
            console.log(candidate)
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
            console.log("answer!")
            console.log(answer)            
            this.peerConnection.setRemoteDescription(answer)
        })


        this.peerConnection.onicecandidate = (event) => {
            console.log("SEND - ICE")
            console.log(event.candidate)            
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
                    max: 360
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
            console.log("offer")
            console.log(this.peerConnection.localDescription)
            this.$socket.emit("RTC_NEW_OFFER", {
                offer: this.peerConnection.localDescription,
                owner: this.$socket.id,
            })
        })

        this.peerConnection.ontrack = (event) => {
            console.log("streams")
            console.log(event.streams)
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