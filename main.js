const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        kiosk: true,
        fullscreen:true,
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'boot.js')
        },

    })

    const audioWin = new BrowserWindow({
        minimizable: true,
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'bootAudio.js')
        },
    })

    ipcMain.on('playAudio', () => {
        audioWin.webContents.send('playAudio')
    })

    ipcMain.on('stopAudio', () => {
        audioWin.webContents.send('stopAudio')
    })

    win.loadFile('home/home.html')
    win.setMenu(null)

    audioWin.loadFile('home/audio.html')
    audioWin.setMenu(null)
    audioWin.minimize()

    win.on('closed', () => {
        audioWin.close()
    })

    //Uncomment to show developer tools
    //win.webContents.openDevTools()
    //audioWin.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
