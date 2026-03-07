import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 用户管理相关 API
  getUsers: (searchText = '', page = 1, pageSize = 10) => 
    ipcRenderer.invoke('user:getUsers', searchText, page, pageSize),
  createUser: (user) => ipcRenderer.invoke('user:createUser', user),
  updateUser: (user) => ipcRenderer.invoke('user:updateUser', user),

  createMoney: (money) => ipcRenderer.invoke('money:createMoney', money),
  getMoneys: (userId = '', page = 1, pageSize = 10) => ipcRenderer.invoke('money:getMoneys', userId, page, pageSize),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electronAPI = electronAPI
  window.api = api
}
