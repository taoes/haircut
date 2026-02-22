import Database from './database';

class UserDao {
    constructor() {
        this.db = new Database();
    }

    // 获取所有用户
    async getUsers(searchText = '', page = 1, pageSize = 10) {
        try {
            let sql = `
                SELECT id, phone, name, gender, balance, 
                       register_time as registerTime, 
                       last_consume_time as lastConsumeTime, 
                       remark, created_at as createdAt
                FROM users 
                WHERE 1=1
            `;
            
            const params = [];
            
            // 添加搜索条件
            if (searchText) {
                sql += ` AND (name LIKE ? OR phone LIKE ?)`;
                params.push(`%${searchText}%`, `%${searchText}%`);
            }
            
            // 添加分页
            sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            params.push(pageSize, (page - 1) * pageSize);
            
            const users = await this.db.query(sql, params);
            console.log("查询用户列表SQL:", sql, "参数:", params);
            console.log("查询用户列表结果:", users);
            
            // 获取总数
            let countSql = `SELECT COUNT(*) as total FROM users WHERE 1=1`;
            const countParams = [];
            
            if (searchText) {
                countSql += ` AND (name LIKE ? OR phone LIKE ?)`;
                countParams.push(`%${searchText}%`, `%${searchText}%`);
            }
            
            const countResult = await this.db.get(countSql, countParams);
            
            return {
                users,
                total: countResult.total
            };
        } catch (error) {
            console.error('获取用户列表失败:', error);
            throw error;
        }
    }

    // 根据ID获取用户
    async getUserById(id) {
        try {
            const sql = `
                SELECT id, phone, name, gender, balance, 
                       register_time as registerTime, 
                       last_consume_time as lastConsumeTime, 
                       remark, created_at as createdAt
                FROM users 
                WHERE id = ?
            `;
            return await this.db.get(sql, [id]);
        } catch (error) {
            console.error('获取用户失败:', error);
            throw error;
        }
    }

    // 创建用户
    async createUser(userData) {
        try {
            const sql = `
                INSERT INTO users (phone, name, gender, balance, register_time, last_consume_time, remark)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                userData.phone,
                userData.name,
                userData.gender,
                userData.balance || 0,
                userData.registerTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
                userData.lastConsumeTime || null,
                userData.remark || ''
            ];
            
            const result = await this.db.run(sql, params);
            return { id: result.id, ...userData };
        } catch (error) {
            console.error('创建用户失败:', error);
            throw error;
        }
    }

    // 更新用户
    async updateUser(id, userData) {
        try {
            const sql = `
                UPDATE users 
                SET phone = ?, name = ?, gender = ?, balance = ?, 
                    register_time = ?, last_consume_time = ?, remark = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            const params = [
                userData.phone,
                userData.name,
                userData.gender,
                userData.balance || 0,
                userData.registerTime || null,
                userData.lastConsumeTime || null,
                userData.remark || '',
                id
            ];
            
            await this.db.run(sql, params);
            return { id, ...userData };
        } catch (error) {
            console.error('更新用户失败:', error);
            throw error;
        }
    }

    // 删除用户
    async deleteUser(id) {
        try {
            const sql = `DELETE FROM users WHERE id = ?`;
            await this.db.run(sql, [id]);
            return true;
        } catch (error) {
            console.error('删除用户失败:', error);
            throw error;
        }
    }

    // 关闭数据库连接
    close() {
        this.db.close();
    }
}

export default UserDao;