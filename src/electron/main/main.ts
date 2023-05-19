// src/electron/main/main.ts
import path, { join } from 'path';
import {
    app,
    BrowserWindow
} from 'electron';

import { spawn } from 'child_process';
import { ChildProcess } from 'child_process';
import  kill  from 'tree-kill'

let jarProcess: ChildProcess | null = null;
var jarPath = app.getAppPath() + "/back/coursetracker-0.0.1-SNAPSHOT.jar";
//fonction pour démarer le back
function startJarProcess() {
    jarProcess = spawn('javaw', ['-jar', jarPath], {stdio: 'ignore' , detached: true, shell: false, windowsHide: true});
} 
//fonction pour arrêter le back
function stopJarProcess() {
    if (jarProcess) {
        kill(jarProcess.pid!, 'SIGINT', function(err) {
      });
      jarProcess = null;
    }
}

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.js'),
        },
        icon: path.join(__dirname, '../../../public/images/randonnee_logo.ico'),
    });
    // and load the index.html of the app. 
    mainWindow.loadURL(
        isDev ?
        'http://localhost:3000' :
        join(__dirname, '../../index.html')
    );
    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    startJarProcess();
});

app.on('before-quit', () => {
      stopJarProcess();
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});



