const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1300,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false // Assurez-vous de bien comprendre les implications de cette option
        }
    });

    // Configure les cookies
    win.webContents.on('did-finish-load', () => {
        session.defaultSession.cookies.get({})
            .then((cookies) => {
                console.log(cookies);
            })
            .catch((error) => {
                console.error(error);
            });
    });

    win.loadFile(path.join(__dirname, 'dist/i-pos-restaurant/browser/index.html')).catch(err => {
        console.error("Failed to load file:", err);
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
