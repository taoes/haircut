const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');

class Database {
    constructor() {
        // 根据操作系统确定数据库路径
        let dbPath;
        console.log('process.platform:', process.platform);
        if (process.platform === 'darwin') {
            // macOS
            dbPath = path.join(os.homedir(), '.config', 'haircut', 'haircut.db');
        } else if (process.platform === 'win32') {
            // Windows
            dbPath = path.join(process.env.APPDATA, 'haircut', 'haircut.db');
        } else {
            // Linux
            dbPath = path.join(os.homedir(), '.config', 'haircut', 'haircut.db');
        }

        // 确保目录存在
        const dbDir = path.dirname(dbPath);
        require('fs').mkdirSync(dbDir, { recursive: true });

        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('数据库连接失败:', err.message);
            } else {
                console.log('数据库连接成功:', dbPath);
                this.initTables();
            }
        });
    }

    initTables() {
        const createUserTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                gender TEXT NOT NULL,
                balance REAL DEFAULT 0,
                register_time TEXT,
                last_consume_time TEXT,
                remark TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `;

        this.db.run(createUserTable, (err) => {
            if (err) {
                console.error('创建用户表失败:', err.message);
            } else {
                console.log('用户表创建成功');
            }
        });
    }
    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('关闭数据库失败:', err.message);
            } else {
                console.log('数据库已关闭');
            }
        });
    }
}

export default Database;