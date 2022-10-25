import Vue from "vue";
import App from "./App"

import { io } from "socket.io-client"
import { serverVirtualIP, expressPort } from "../../ConnectionConfig"

// Socket is accessible globally via this.$socket
Vue.prototype.$socket = io(`http://${serverVirtualIP}:${expressPort}/`);

new Vue({
    el: "#app",
    render: h => h(App)
})