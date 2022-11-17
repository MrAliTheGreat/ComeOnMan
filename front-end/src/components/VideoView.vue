<template>
    <div class="on-middle">
        <div class="local-container">
            <div style="position: relative; margin: 25px;">
                <img v-if="isLocalVideoOff" 
                    :src="user.avatar"
                    class="no-video-alt"
                    @click="onLocalClick"
                />
                <img v-if="isLocalAudioOff" 
                    src="/no-mic.png"
                    class="no-audio-alt"
                    @click="onLocalClick"
                />            
                <video autoplay playsinline muted :srcObject.prop="localStream" class="local-start" ref="local" @click="onLocalClick"></video>
            </div>
            <div class="controls-container">
                <div style="border-bottom: 1px solid white">
                    <img src="/video-off.png" @click="onVidOff"/>
                    <img src="/mic-off.png" @click="onMicOff"/>
                </div>
                <img src="/hangup.png" @click="onEndCall"/>
            </div>
        </div>
        <div style="flex: 1; display: flex; position: relative;">
            <img v-if="isPeerVideoOff" 
                :src="peer.avatar"
                class="no-peer-video-alt"
            />
            <img v-if="isPeerAudioOff" 
                src="/no-mic.png"
                class="no-peer-audio-alt"
            />                    
            <video 
                v-for="remoteStream, index in remoteStreams"
                :key="index"
                autoplay
                playsinline
                :srcObject.prop="remoteStream"
                class="remote"
            ></video>
        </div>
    </div>
</template>

<script>
import "webrtc-adapter"

export default {
    name: "VideoView",
    data() {
        return {
            isLocalVideoOff: false,
            isPeerVideoOff: false,
            isLocalAudioOff: false,
            isPeerAudioOff: false,
            peer: {},

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
    props: [ "user" ],
    mounted() {
        this.$socket.on("ICE_CANDIDATE", (candidate) => {
            this.peerConnection && this.peerConnection.connectionState !== "closed" ? this.peerConnection.addIceCandidate(candidate) : null
        })
        this.$socket.on("OFFER", ({ offer, owner }) => {
            this.peerConnection ? this.peerConnection.setRemoteDescription(offer).then(() => {
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
            }) : null
        })
        this.$socket.on("ANSWER", (answer) => {          
            this.peerConnection ? this.peerConnection.setRemoteDescription(answer) : null
        })
        this.$socket.on("CALL_ENDED", () => {
            if(this.peerConnection){
                this.peerConnection.close()
                this.$emit("chat")
            }
        })
        this.$socket.on("PEER_VIDEO_OFF", ({ peer, peerVideoStatus }) => {
            this.isPeerVideoOff = peerVideoStatus
            this.peer = peer
        })
        this.$socket.on("PEER_MIC_OFF", (peerMicStatus) => {
            this.isPeerAudioOff = peerMicStatus
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
    methods: {
        stopLocalMedia(mediaType) {
            this.localStream.getTracks().forEach((track) => {
                if(track.readyState === "live" && track.kind === mediaType) {
                    track.stop()
                }
            })
        },
        onLocalClick() {
            if(this.$refs.local){
                if(this.$refs.local.className === "local-compact" || this.$refs.local.className === "local-start") {
                    this.$refs.local.className = "local-normal"
                    return
                }
                this.$refs.local.className = "local-compact"
            }
        },
        onEndCall() {
            this.$emit("chat")
        },
        onVidOff(event) {
            event.target.className === "" ?  event.target.className = "img-selected" : event.target.className = ""
            this.localStream.getVideoTracks().forEach((videoTrack) => {
                videoTrack.enabled = !videoTrack.enabled
            })
            this.isLocalVideoOff = !this.isLocalVideoOff
            this.$socket.emit("LOCAL_VIDEO_OFF", {peer: this.user, peerVideoStatus: this.isLocalVideoOff})
        },
        onMicOff(event) {
            event.target.className === "" ?  event.target.className = "img-selected" : event.target.className = ""
            this.localStream.getAudioTracks().forEach((audioTrack) => {
                audioTrack.enabled = !audioTrack.enabled
            })
            this.isLocalAudioOff = !this.isLocalAudioOff
            this.$socket.emit("LOCAL_MIC_OFF", this.isLocalAudioOff)
        }
    },
    beforeDestroy() {
        this.stopLocalMedia("video")
        this.stopLocalMedia("audio")
        this.localStream.getTracks().forEach((track) => {
            track.stop()
        })
        this.peerConnection.close()
        this.peerConnection = null
        this.$socket.emit("RTC_CALL_ENDED")
    }
}
</script>

<style scoped>
/* Mobile */
@media (max-width:850px) {
    .on-middle {
        flex: 1;
        flex-direction: column !important;
    }

    .local-start {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        margin: 10px;
        border: 2px solid #7FFFCB;
        box-shadow: 0px 0px 10px #7FFFCB;
        align-self: center;
    }

    .local-compact {
        object-fit: cover;
        margin: 10px;
        border: 2px solid #7FFFCB;
        box-shadow: 0px 0px 10px #7FFFCB;
        align-self: center;
        animation: shrink 0.6s forwards;
    }

    .local-normal {
        object-fit: cover;
        margin: 10px;
        border: 2px solid #7FFFCB;
        box-shadow: 0px 0px 10px #7FFFCB;
        align-self: center;
        animation: expand 0.6s forwards;
    }

    .local-start:hover, .local-compact:hover, .local-normal:hover {
        cursor: pointer;
    }

    .remote {
        flex: 1;
        width: 100vw;
        object-fit: cover;
        border-radius: 3%;
        margin: 10px;
        border: 2px solid #84F4FF;
        box-shadow: 0px 0px 10px #84F4FF;
        align-self: center;
    }

    @keyframes expand {
        0% {
            width: 150px;
            height: 150px;
            border-radius: 50%;
        }
        100% {
            width: 100vw;
            height: 360px;
            border-radius: 3%;
        }
    }

    @keyframes shrink {
        0% {
            width: 100vw;
            height: 360px;
            border-radius: 3%;
        }
        25% {
            border-radius: 3%;
        }
        100% {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
        }
    }
}

/* PC */
@media (min-width:851px) {
    .on-middle {
        flex: 1;
        flex-direction: row !important;
    }

    .local-container {
        align-self: flex-start;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .controls-container{
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .local-start {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #7FFFCB;
        box-shadow: 0px 0px 10px #7FFFCB;
    }

    .local-compact {
        object-fit: cover;
        border: 2px solid #7FFFCB;
        box-shadow: 0px 0px 10px #7FFFCB;
        animation: shrink 0.6s forwards;
    }

    .local-normal {
        object-fit: cover;
        border: 2px solid #7FFFCB;
        box-shadow: 0px 0px 10px #7FFFCB;
        animation: expand 0.6s forwards;
    }

    .local-start:hover, .local-compact:hover, .local-normal:hover {
        cursor: pointer;
    }

    .remote {
        flex: 1;
        border-radius: 3%;
        border: 2px solid #84F4FF;
        box-shadow: 0px 0px 10px #84F4FF;
    }

    img {
        height: 70px;
        width: 70px;
        margin: 5px;
        border-radius: 50%;
    }

    img:hover {
        cursor: pointer;
    }

    img:active {
        opacity: 0.5;
    }

    .img-selected {
        height: 70px;
        width: 70px;
        margin: 5px;
        padding: 6px;
        border-radius: 50%;
        border: 2px solid #C10C5E;
        box-shadow: 0px 0px 10px #C10C5E;
    }

    .no-video-alt {
        position: absolute;
        height: 100px;
        width: 100px;
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-54.5%, -56%);
    }

    .no-peer-video-alt{
        position: absolute;
        height: 150px;
        width: 150px;
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .no-audio-alt {
        position: absolute;
        height: 35px;
        width: 35px;
        border-radius: 50%;
        background-color: black;
        left: 50%;
        transform: translateX(-60%);
    }

    .no-peer-audio-alt {
        position: absolute;
        height: 35px;
        width: 35px;
        border-radius: 50%;
        background-color: black;
        left: 50%;
        transform: translateX(-50%);
    }    

    @keyframes expand {
        0% {
            width: 180px;
            height: 180px;
            border-radius: 50%;
        }
        100% {
            width: 480px;
            height: 360px;
            border-radius: 3%;
        }
    }

    @keyframes shrink {
        0% {
            width: 480px;
            height: 360px;
            border-radius: 3%;
        }
        25% {
            border-radius: 3%;
        }
        100% {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            object-fit: cover;
        }
    }
}
</style>