const { app } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.initDatabase();
  }

  // 初始化数据库
  initDatabase() {
    try {
      // 获取用户根目录路径
      const userDataPath = app.getPath('home');
      const dbPath = path.join(userDataPath, '.haircut.db');
      
      console.log('数据库路径:', dbPath);
      
      // 创建数据库连接
      this.db = new Database(dbPath);
      
      // 启用外键约束
      this.db.pragma('foreign_keys = ON');
      
      // 初始化用户表
      this.initUserTable();
      
      console.log('数据库初始化成功');
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }

  // 初始化用户表
  initUserTable() {
    const createUserTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        gender TEXT CHECK(gender IN ('male', 'female')) NOT NULL,
        balance DECIMAL(10,2) DEFAULT 0.00,
        register_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_consume_time DATETIME,
        remark TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    this.db.exec(createUserTableSQL);
    console.log('用户表初始化完成');
  }

  // 获取数据库实例
  getDB() {
    return this.db;
  }

  // 关闭数据库连接
  close() {
    if (this.db) {
      this.db.close();
      console.log('数据库连接已关闭');
    }
  }
}

// 导出单例实例
const dbManager = new DatabaseManager();
export default dbManager;