# A Utility to transfer files from one device to another

## Steps to transfer files

1. Connect source and target devices to the same network
2. Run the following commands in your command prompt / terminal

```
git clone https://github.com/PrasannaPanneerSelvam/file-sharing.git
cd file-sharing
npm i
npm start
```

3. Copy the local IP address from the terminal and paste in the value of `localIP` in the [/public/index.html](/public/index.html) file
4. Open `<localIP>:3000` in the source device's web browser and transfer your files.
