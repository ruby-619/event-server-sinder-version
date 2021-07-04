const express = require('express');

const Cart = require(__dirname + '/../models/Cart');

const router = express.Router();


// 取得購物車的內容
router.get('/', async (req, res)=>{
    res.json(Cart.getContents(req.session));
});

// 加入商品
router.get('/add', async (req, res)=>{
    const {sid, quantity} = req.query;

    res.json( Cart.add(req.session, sid, quantity) );
});

// 修改數量
router.get('/update', async (req, res)=>{
    const {sid, quantity} = req.query;

    res.json( Cart.update(req.session, sid, quantity) );
});

// 移除項目
router.get('/remove/:sid', async (req, res)=>{
    res.json( Cart.remove(req.session, req.params.sid) );
});

// 清空
router.get('/clear', async (req, res)=>{
    res.json( Cart.clear(req.session) );
});

module.exports = router;