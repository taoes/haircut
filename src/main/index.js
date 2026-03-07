import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import UserDao from './userDao'
import MoneyDao from './moneyDao'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  const userDao = new UserDao();
  const moneyDao = new MoneyDao();

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 用户管理相关 IPC 处理
  ipcMain.handle('user:getUsers', async (event, searchText, page, pageSize) => {
    try {
      return await userDao.getUsers(searchText, page, pageSize);
    } catch (error) {
      console.error('IPC 调用获取用户列表失败:', error);
      throw error;
    }
  });

  ipcMain.handle('user:createUser', async (event, userData) => {
    try {
      return await userDao.createUser(userData);
    } catch (error) {
      console.error('IPC 调用创建用户失败:', error);
      throw error;
    }
  });

  ipcMain.handle('user:updateUser', async (event, userData) => {
    try {
      return await userDao.updateUser(userData.id, userData);
    } catch (error) {
      console.error('IPC 调用更新用户失败:', error);
      throw error;
    }
  });

  // 金额管理相关 IPC 处理
  ipcMain.handle('money:createMoney', async (event, moneyData) => {
    try {
      return await moneyDao.createMoney(moneyData);
    } catch (error) {
      console.error('IPC 调用创建金额记录失败:', error);
      throw error;
    }
  });

  ipcMain.handle('money:getMoneys', async (event, userId, page, pageSize) => {
    try {
      return await moneyDao.getMoneys(userId, page, pageSize);
    } catch (error) {
      console.error('IPC 调用获取金额记录失败:', error);
      throw error;
    }
  });

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
