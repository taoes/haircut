import  dbManager  from './database';

class UserDAO {
  constructor() {
    this.db = dbManager.getDB();
  }

  // 查询所有用户（支持分页和搜索）
  getUsers(page = 1, pageSize = 10, search = '') {
    try {
      const offset = (page - 1) * pageSize;
      
      let sql = 'SELECT * FROM users';
      let countSql = 'SELECT COUNT(*) as total FROM users';
      const params = [];
      
      // 添加搜索条件
      if (search) {
        sql += ' WHERE name LIKE ? OR phone LIKE ?';
        countSql += ' WHERE name LIKE ? OR phone LIKE ?';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
      }
      
      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      
      // 查询数据
      const users = this.db.prepare(sql).all(...params, pageSize, offset);
      
      // 查询总数
      const countResult = this.db.prepare(countSql).get(...params);
      
      return {
        users,
        total: countResult.total,
        page,
        pageSize
      };
    } catch (error) {
      console.error('查询用户列表失败:', error);
      throw error;
    }
  }

  // 根据ID查询用户
  getUserById(id) {
    try {
      const sql = 'SELECT * FROM users WHERE id = ?';
      return this.db.prepare(sql).get(id);
    } catch (error) {
      console.error('查询用户失败:', error);
      throw error;
    }
  }

  // 创建用户
  createUser(userData) {
    try {
      const sql = `
        INSERT INTO users (phone, name, gender, balance, register_time, last_consume_time, remark)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const result = this.db.prepare(sql).run(
        userData.phone,
        userData.name,
        userData.gender,
        userData.balance || 0,
        userData.register_time || new Date().toISOString(),
        userData.last_consume_time || null,
        userData.remark || ''
      );
      
      return {
        id: result.lastInsertRowid,
        ...userData
      };
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  }

  // 更新用户
  updateUser(id, userData) {
    try {
      const sql = `
        UPDATE users 
        SET name = ?, gender = ?, balance = ?, last_consume_time = ?, remark = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const result = this.db.prepare(sql).run(
        userData.name,
        userData.gender,
        userData.balance || 0,
        userData.last_consume_time || null,
        userData.remark || '',
        id
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  }

  // 删除用户
  deleteUser(id) {
    try {
      const sql = 'DELETE FROM users WHERE id = ?';
      const result = this.db.prepare(sql).run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('删除用户失败:', error);
      throw error;
    }
  }

  // 检查手机号是否存在
  checkPhoneExists(phone, excludeId = null) {
    try {
      let sql = 'SELECT COUNT(*) as count FROM users WHERE phone = ?';
      const params = [phone];
      
      if (excludeId) {
        sql += ' AND id != ?';
        params.push(excludeId);
      }
      
      const result = this.db.prepare(sql).get(...params);
      return result.count > 0;
    } catch (error) {
      console.error('检查手机号失败:', error);
      throw error;
    }
  }
}

export default UserDAO;