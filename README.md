# ComeOnMan!

ComeOnMan is a chat app which helps staying connected even when the Internet is blocked. I know that is a lot to promise but this is what I am trying to achieve here!
***

## Initial Setup
ComeOnMan uses WireGuard for making a virtual network. Devices will connect to the server via WireGurad and then the communication begins.

### WireGurad Setup

After installing WireGuard, We have to make a new tunnel. Inside the config file, under interface, we have to specify the new virtual address and listen port of the current device. Under peer, we have to place all the devices which want to connect. We must specify each of their public keys, new virtual addresses and endpoints. For endpoint, we have to get each of the peers' public IP address which can be found with a simple search online. After this setup on all the devices in the virtual network, we can ping any device from any other device. We can then move on to the next section for setting up the server.

### Back-end
After setting up WireGuard, we have to start the backend server. The backend server uses socket.io to make real-time communication possible. To start the server, first, all the dependencies must be installed using npm, so by running the command `npm install` in /back-end directory this part can be covered. Then, the IP address of the host must be set up in the backend. The IP address used here is the same as host virtual address placed in WireGuard. After setting IP address and a desirable port number in a file named ConnectionConfig.js at the root project directory, we can finally start the back-end server by running the command `npm run dev` in /back-end directory. If everything is gone right you can see a message saying "Express: Listening on port ---!"

### Front-end
After running the backend server, we have to run the frontend code. Again, just like back-end, dependencies must be installed. Also, the frontend uses Vue framework so vue-cli needs to be installed. After all the installations, the IP address needs to be set up, just like backend. However, for frontend, the IP address must be placed at the end of serve script in front-end's package.json file. By adding "--host IP_ADDRESS" to the end of serve script everything will be set up for running the frontend code. So, finally, by running the command `npm run serve` in the /front-end directory, the app can be access at "http://IP_ADDRESS:8080/". Again, IP_ADDRESS is the same as the one in WireGuard!

***
## Upcoming Features
- [x] **Real Time Chat**
- [ ] **Voice Call**
- [ ] **Video Call**