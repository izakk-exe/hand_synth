// Palma — electron main
// Built by 1Z4K

const { app, BrowserWindow, ipcMain, session, shell } = require("electron");
const path = require("path");

// ---- compatibility switches so the app runs on a wide range of hardware ----
// camera / media
app.commandLine.appendSwitch("enable-features", "WebRTC");
app.commandLine.appendSwitch("use-fake-ui-for-media-stream"); // auto-accept getUserMedia
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

// force WebGL on quirky integrated GPUs (SwiftShader fallback if driver is blacklisted)
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("enable-unsafe-swiftshader");
app.commandLine.appendSwitch("enable-accelerated-video-decode");
// older intel chips benefit from this
app.commandLine.appendSwitch("disable-features", "UseChromeOSDirectVideoDecoder");
// electron sandbox off (we already set sandbox:false in webPreferences)
app.commandLine.appendSwitch("no-sandbox");

let win;

function createWindow(){
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#07070b",
    show: false,
    frame: false,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    title: "Palma — 1Z4K",
    icon: path.join(__dirname, "assets", "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: false
    }
  });

  // auto-grant camera to the local app
  session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => {
    if (permission === "media" || permission === "mediaKeySystem" || permission === "fullscreen"){
      return cb(true);
    }
    cb(false);
  });

  session.defaultSession.setPermissionCheckHandler(() => true);

  win.loadFile("index.html");
  win.once("ready-to-show", () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.on("closed", () => { win = null; });
}

ipcMain.handle("win:minimize", () => win && win.minimize());
ipcMain.handle("win:maximize", () => {
  if (!win) return;
  if (win.isMaximized()) win.unmaximize(); else win.maximize();
});
ipcMain.handle("win:close",    () => win && win.close());
ipcMain.handle("win:fullscreen", () => {
  if (!win) return;
  win.setFullScreen(!win.isFullScreen());
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
