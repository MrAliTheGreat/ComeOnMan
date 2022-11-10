<template>
    <div class="on-middle">
        <video autoplay playsinline muted :srcObject.prop="localStream"></video>
        <video v-for="remoteStream, index in remoteStreams" :key="index" autoplay playsinline :srcObject.prop="remoteStream"></video>
    </div>
</template>

<script>
import "webrtc-adapter"

export default {
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
                    max: 852
                },
                height: {
                    max: 480
                },
                frameRate: 30
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
}

.on-middle {
    display: flex;
    align-items: center;
    flex: 1;
}
</style>