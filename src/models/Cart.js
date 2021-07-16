const e = require("cors")

const cartName = 'cart1'

// 購物車格式：[{sid:1, quantity:2},{sid:2,quantity:3}]
class Cart{


    static contents(session){ // 取得購物車內容,沒有用到資料庫

        return session[cartName] || []//預設給空陣列
    }
    // 加入商品
    static add(session, itemSid, quantity=1){ 
        const output = {
            success :false,
            cart:[]
        }
        let cart = session[cartName]
        
        // 檢查有沒有這項商品

        let result = cart.filter(el=>itemSid===el.sid)
        if(!result.length) {
            cart.push({
                sid:itemSid,
                quantity
            })
        output.success =true

        }
       
        output.cart = Cart.getContents(session)
        return output
    }


  // 變更商品數量
  static update(session, itemSid, quantity=1) {
    session[cartName] = session[cartName] || [];
    const output = {
        success: false,
        cart: []
    };
    let cart = session[cartName];
    let results = cart.filter(el => itemSid===el.sid );
    if(results.length){
        results[0].quantity = quantity;
        output.success = true;
        output.cart = Cart.getContents(session);
        return output;
    } else {
        // 如果沒有這個商品就加入
        return Cart.add(session, itemSid, quantity);
    }
}

    // 移除商品
// 移除商品項目
static remove(session, itemSid) {
    session[cartName] = session[cartName] || [];
    const output = {
        success: false,
        cart: []
    };
    let cart = session[cartName];
    let oriLength = cart.length;
    let results = cart.filter(el => itemSid !== el.sid );

    if(results.length !== oriLength){
        output.success = true;
    }
    output.cart = Cart.getContents(session);
    return output;
}
    // 清空購物車
    static clear(session) {
        session[cartName] = [];
        const output = {
            success: true,
            cart: []
        };
        return output;
    }




}

module.exports = Cart
