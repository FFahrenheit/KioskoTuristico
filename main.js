const { app, BrowserWindow } = require('electron');
const url = require("url");
const path = require("path");

let win;

let createWindow = () => {

    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        backgroundColor: '#ffffff',
        icon: url.format({
            pathname: path.join(__dirname, `/icon.png`),
            protocol: "file:",
            slashes: true
          }) 
        //`file://${__dirname}/dist/assets/icon.png`
    });

    win.loadURL(
        url.format({
          pathname: path.join(__dirname, `/dist/index.html`),
          protocol: "file:",
          slashes: true
        })
    );


    win.on('closed', () => {
        win = null
    });
}


app.on('ready', createWindow); 

app.on('window-all-closed', () =>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate',()=>{
    if(win === null){
        createWindow();
    }
});