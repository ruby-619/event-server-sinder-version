const express = require("express");
const router = express.Router();
const db = require(__dirname + '/../modules/mysql2-connect');

router.get('/',(req, res) => {
    if(req.session.admin) {
        res.redirect('/') //若登入轉向首頁
    } else {
        res.render('login')
    }
    res.render('login')
})

// 表單傳遞一般欄位資料
router.post('/',async (req, res) => {
    const output = {
        success: false,
        error: '帳號或密碼錯誤',
        body: req.body
    }

    const sql = "SELECT * FROM `users` WHERE " + `userEmail = '${req.body.account}' AND userPassword = '${req.body.password}'`
    const [account] = await db.query(sql)

    // 有資料，正列有長度
    if(account.length) {
        req.session.user = account[0]
        output.success = true
        output.error = ""
        output.data = account[0]
        res.json(output)
    } else {
        res.json(output)
    }
})


module.exports = router;