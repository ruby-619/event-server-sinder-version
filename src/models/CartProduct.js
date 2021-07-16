const db = require(__dirname + '/../modules/mysql2-connect')
const cartName = "cartProduct";

// 購物車的內容(通常不會放價格)
// [{sid:1, quantity:2}, {sid:2, quantity:3}]
class CartProduct {
    // 因為不用到資料庫所以不用async
    // 取得購物車的內容
    static getContents(session) {
        session[cartName] = session[cartName] || [];
        return session[cartName];
    }

    // 加入商品
    static async add(session, itemSid, quantity=1) {
        session[cartName] = session[cartName] || [];
        const output = {
            success: false,
            cart: []
        };
        let cart = session[cartName];

        // 檢查購物車裡是否已經有這項商品
        let results = cart.filter(el => itemSid===el.itemId );
        if(! results.length){
            // 如果沒有在購物車裡

            // 檢查資料表有沒有這項商品
            let sql = "SELECT `itemId`, `itemName`, `itemImg`, `itemPrice`, `itemQty`, `itemDescription`, `itemCategoryId`, `created_at`, `updated_at` FROM `items` WHERE `itemId`=?";
            let [rs] = await db.query(sql, [itemSid]);
            if(rs && rs.length){
                cart.push({
                    ...rs[0],
                    quantity
                });
                output.success = true;
            }
        }

        output.cart = CartProduct.getContents(session);
        return output;
    }

    // 變更商品數量
    static async update(session, itemSid, quantity = 1) {
        session[cartName] = session[cartName] || [];
        const output = {
            success: false,
            cart: [],
        };

        let cart = session[cartName];
        let results = cart.filter(el => itemSid === el.itemId);
        if (results.length) {
            results[0].quantity = quantity;
            output.success = true;
            output.cart = CartProduct.getContents(session);
            return output;
        } else {
            // 沒有這個商品就加入
            return await CartProduct.add(session, itemSid, quantity);
        }
    }

    // 移除商品
    static remove(session, itemSid) {
        session[cartName] = session[cartName] || [];
        const output = {
            success: false,
            cart: []
        };
        let cart = session[cartName];
        let oriLength = cart.length;
        session[cartName] = cart.filter(el => itemSid !== el.itemId );

        if(session[cartName].length !== oriLength){
            output.success = true;
        }
        output.cart = CartProduct.getContents(session);
        return output;
    }

    // 清空購物車
    static clear(session) {
        session[cartName] = []
        const output = {
            success: true,
            cart: [],
        };
        return output;
    }


}

module.exports = CartProduct;
