import Database from './database';


class MoneyDao {

    constructor() {
        this.db = new Database();
    }

    async getMoneys(userId = '', page = 1, pageSize = 10) {
        try {

            const sql = `
                SELECT * FROM moneys
                ORDER BY id DESC
                LIMIT ? OFFSET ?
            `;
            const offset = (page - 1) * pageSize;
            const params = [pageSize, offset];
            const result = await this.db.query(sql, params);

            // 查询根据result集合中的user_id 批量查询用户信息
            const userIds = result.map(item => item.user_id);
            let userMap = {};
            let phoneMap = {};
            if (userIds.length > 0) {
                const userSql = `
                    SELECT id, name,phone FROM users
                    WHERE id IN (${userIds.map(() => '?').join(',')})
                `;
                const userResult = await this.db.query(userSql, userIds);
                userMap = userResult.reduce((map, user) => {
                    map[user.id] = user.name;
                    return map;
                }, {});
                phoneMap = userResult.reduce((map, user) => {
                    map[user.id] = user.phone;
                    return map;
                }, {});
            }

            // 将用户名称添加到结果中
            result.forEach(item => {
                item.userName = userMap[item.user_id] || '-';
                item.phone = phoneMap[item.user_id] || '-';
            });

            return result;
        } catch (error) {
            console.error('获取金额记录失败:', error);
            throw error;
        }

    }

    async createMoney(moneyData) {
        try {
            console.log('创建金额记录参数:', moneyData);
            // 查询前置金额
            const priceBeforeRow = await this.db.get(
                `SELECT counts FROM moneys WHERE user_id  = ? order by id desc limit 1`,
                [moneyData.userId]
            );

            const priceBefore = priceBeforeRow ? priceBeforeRow.counts : 0;
            const priceAfter = moneyData.type === '充值' ? priceBefore + moneyData.price : priceBefore - moneyData.price;

            const sql = `
                INSERT INTO moneys (user_id,type,price_before,price_after,counts,discount,remark)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                moneyData.userId,
                moneyData.type,
                priceBefore,
                priceAfter,
                moneyData.price * 100 || 0,
                moneyData.discount || 100,
                moneyData.remark || ''
            ];

            console.log('插入金额记录参数:', params);
            const result = await this.db.run(sql, params);


            // 更新用户余额和消费次数
            const updateUserSql = `
                UPDATE users
                SET counts=?, last_consume_time = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            await this.db.run(updateUserSql, [priceAfter, moneyData.userId]);

            return { id: result.id, ...moneyData };

        } catch (error) {
            console.error(error);
            console.error('创建核销金额失败:', error);
            throw error;
        }
    }
}

export default MoneyDao;