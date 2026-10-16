// Palma — preload bridge
// Built by 1Z4K

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("winctl", {
  minimize:   () => ipcRenderer.invoke("win:minimize"),
  maximize:   () => ipcRenderer.invoke("win:maximize"),
  close:      () => ipcRenderer.invoke("win:close"),
  fullscreen: () => ipcRenderer.invoke("win:fullscreen")
});
