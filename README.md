# ComeOnMan!

ComeOnMan is a chat app which helps staying connected even when the Internet is blocked. I know that is a lot to promise but this is what I am trying to achieve here!
***

## Initial Setup
ComeOnMan uses WireGuard for making a virtual network. Devices will connect to the server via WireGurad and then the communication begins.

### WireGurad Setup

After installing WireGuard, We have to make a new tunnel. Inside the config file, under interface, we have to specify the new virtual address and listen port of the current device. Under peer, we have to place all the devices which want to connect. We must specify each of their public keys, new virtual addresses and endpoints. For endpoint, we have to get each of the peers' public IP address which can be found with a simple search online. After this setup on all the devices in the virtual network, we can ping any device from any other device. We can then move on to the next section for setting up the server.

***
## Upcoming Features
- **Real Time Chat**
- **Voice Call**
- **Video Call**