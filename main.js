const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        kiosk: true,
        fullscreen:true,
        focusable: true,
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'boot.js')
        },

    })

    const audioWin = new BrowserWindow({
        minimizable: true,
        show: false,
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'bootAudio.js')
        },
    })

    ipcMain.on('setTrackName', (event, track) => {
        audioWin.webContents.send('setTrackName', track)
    })

    ipcMain.on('playAudio', () => {
        audioWin.webContents.send('playAudio')
    })

    ipcMain.on('stopAudio', () => {
        audioWin.webContents.send('stopAudio')
    })

    audioWin.loadFile('home/audio.html')
    audioWin.setMenu(null)

    win.loadFile('home/home.html')
    win.setMenu(null)

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
