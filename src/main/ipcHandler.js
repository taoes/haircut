const { ipcMain } = require('electron');
import UserDAO from './userDao';

class IPCHandler {
  constructor() {
    this.userDAO = new UserDAO();
    this.setupHandlers();
  }

  setupHandlers() {
    // 获取用户列表
    ipcMain.handle('get-users', async (event, options) => {
      try {
        const { page = 1, pageSize = 10, search = '' } = options || {};
        const result = this.userDAO.getUsers(page, pageSize, search);
        return { success: true, data: result };
      } catch (error) {
        console.error('获取用户列表失败:', error);
        return { success: false, error: error.message };
      }
    });

    // 获取单个用户
    ipcMain.handle('get-user', async (event, id) => {
      try {
        const user = this.userDAO.getUserById(id);
        return { success: true, data: user };
      } catch (error) {
        console.error('获取用户失败:', error);
        return { success: false, error: error.message };
      }
    });

    // 创建用户
    ipcMain.handle('create-user', async (event, userData) => {
      try {
        // 检查手机号是否已存在
        if (this.userDAO.checkPhoneExists(userData.phone)) {
          return { success: false, error: '手机号已存在' };
        }
        
        const user = this.userDAO.createUser(userData);
        return { success: true, data: user };
      } catch (error) {
        console.error('创建用户失败:', error);
        return { success: false, error: error.message };
      }
    });

    // 更新用户
    ipcMain.handle('update-user', async (event, id, userData) => {
      try {
        // 检查手机号是否已存在（排除当前用户）
        if (this.userDAO.checkPhoneExists(userData.phone, id)) {
          return { success: false, error: '手机号已存在' };
        }
        
        const result = this.userDAO.updateUser(id, userData);
        if (result) {
          return { success: true, message: '用户更新成功' };
        } else {
          return { success: false, error: '用户不存在或未发生变化' };
        }
      } catch (error) {
        console.error('更新用户失败:', error);
        return { success: false, error: error.message };
      }
    });

    // 删除用户
    ipcMain.handle('delete-user', async (event, id) => {
      try {
        const result = this.userDAO.deleteUser(id);
        if (result) {
          return { success: true, message: '用户删除成功' };
        } else {
          return { success: false, error: '用户不存在' };
        }
      } catch (error) {
        console.error('删除用户失败:', error);
        return { success: false, error: error.message };
      }
    });
  }
}

export default IPCHandler;