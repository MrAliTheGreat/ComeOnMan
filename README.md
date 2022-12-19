# ComeOnMan!

<div align="justify">
ComeOnMan is a chat app which helps people to stay connected even when the Internet is blocked. I know this is a lot to promise but it is what I am trying to achieve here!
</div>

<br />

---

## Initial Setup

<div align="justify">
ComeOnMan uses Tailscale or WireGuard for making a virtual network. Devices will connect to the server via Tailscale or WireGurad and then the communication begins.

One important note here is that WireGuard can be blocked easily. WireGuard has no packet obfuscation so it can be compromised without too much trouble. Now, there are a lot of different ways to obfuscate your packets but with the research I have done Tailscale seems to be a promising tool. Let me be clear, Tailscale is not an obfuscation tool. In fact, it is a mesh VPN provider and the protocol running under the hood is WireGuard. That is the reason I chose it over Zerotier which is another mesh VPN provider. Certainly, Tailscale is using an obfuscation tool of some sort since although it runs with WireGurad packets have not been blocked and everything runs without any problem. One more thing that really stands out in Tailscale is that it has a really easy-to-work-with UI. That is the whole point of ComeOnMan since this app wants to create a way of communication that any one with any amount of computer knowledge can easily work with. Tailscale has an amazing documentation so for learning more about it you can visit their website.
</div>

<br />

### Tailscale Setup

<div align="justify">
First, you have to create a free account. Tailscale does not have its own account system. However, it supports services like Google, Microsoft, GitHub and others. So, by just having a gmail you can start using Tailscale. After that, you have to install Tailscale app on your device and login to your account. That's it! By now, you will have a private network and a unique IP will be assigned to your device. This IP can only be accessed from inside your private network. For adding other devices you can do the same procedure on each device. You can also share your devices on your private network with others. This way other people from other private networks will just have access to the device you shared with them and no other device. This way anyone with a Tailscale account can access your shared device from their own device which has Tailscale app.

For disconnecting Tailscale on Windows, you have to exit the app and turn off Tailscale service from services. Also remember to set Tailscale service start to manual and disable Tailscale running on startup. This way you can start or exit Tailscale whenever you want to communicate with someone via ComeOnMan.
</div>

<br />

### WireGurad Setup

<div align="justify">
After installing WireGuard, We have to make a new tunnel. Inside the config file, under interface, we have to specify the new virtual address and listen port of the current device. Under peer, we have to place all the devices which want to connect. We must specify each of their public keys, new virtual addresses and endpoints. For endpoint, we have to get each of the peers' public IP address which can be found with a simple search online. After this setup on all the devices in the virtual network, we can ping any device from any other device. We can then move on to the next section for setting up the server.

As mentioned above WireGuard on its own can get blocked so if WireGuard does not create the connection between your devices you can use Tailscale instead.
</div>

<br />

### Back-end

<div align="justify">
After setting up WireGuard, we have to start the backend server. The backend server uses socket.io to make real-time communication possible. To start the server, first, all the dependencies must be installed using npm, so by running the command `npm install` in /back-end directory this part can be covered. Then, the IP address of the host must be set up in the backend. The IP address used here is the same as host virtual address placed in WireGuard. After setting IP address and a desirable port number in a file named ConnectionConfig.js at the root project directory, we can finally start the back-end server by running the command `npm run dev` in /back-end directory. If everything is gone right you can see a message saying "Express: Listening on port ---!"
</div>

<br />

### Front-end

<div align="justify">
After running the backend server, we have to run the frontend code. Again, just like back-end, dependencies must be installed. Also, the frontend uses Vue framework so vue-cli needs to be installed. After all the installations, the IP address needs to be set up, just like backend. However, for frontend, the IP address must be placed at the end of serve script in front-end's package.json file. By adding "--host IP_ADDRESS" to the end of serve script everything will be set up for running the frontend code. So, finally, by running the command `npm run serve` in the /front-end directory, the app can be accessed.
</div>

<br />

## Usage

<div align="justify">
Now that the backend and frontend are running, to start using ComeOnMan! first you have to go to https://IP_ADDRESS:3000/. After loading up this page on your browser you have to accept the certificate before continuing. Just go to advanced and proceed ahead. The page will show a message saying "Welcome to ComeOnMan Backend Server!". After seeing this message on the page, you can access ComeOnMan! on https://IP_ADDRESS:8080/. Again the certificate will show up and you have do the exact same action from before. After this ComeOnMan! will be ready for you to use.
</div>

<br />
<br />

## Upcoming Features

- [x] **Real Time Chat**
- [x] **One-on-one Voice Call**
- [x] **One-on-one Video Call**
- [ ] **Screen Share**
- [x] **File Transfer**
- [ ] **Group Voice Call**
- [ ] **Group Video Call**