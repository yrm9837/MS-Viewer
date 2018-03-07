# spectra_visualization

### Linux (Ubuntu):

```sh
# install nodejs, npm and module
cd src
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install express
sudo npm install multer
sudo npm install chalk

# set up server port
sudo iptables -I INPUT -p tcp --dport 8081 -j ACCEPT
sudo service network-manager restart

# run server
cd src
node server.js
```
Then open link http://127.0.0.1:8081/2Dindex.html to use the MS1/MS2 viewer or open link http://127.0.0.1:8081/3Dindex.html to use the LC-MS 3 dimenaionl viewer.
