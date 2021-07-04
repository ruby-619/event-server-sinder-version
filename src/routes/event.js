// 這邊是路由檔案
const express = require('express');

const Event = require(__dirname + '/../models/Event');

const router = express.Router();

/*
列表 + 篩選 (包含關鍵字搜尋）

單項商品

 */

// 取得所有商品 + 篩選 ?
router.get('/', async (req, res)=>{
    res.json(await Event.getRows());
    
});


// 新增商品測試
router.get('/add', async (req, res)=>{
    // const p1 = new Product({ //當物件使用
    //     author: 'abc',
    //     bookname: 'XX大全',
    // });
    // const obj1 = await p1.save(); //存起來


    // const p2 = await Product.getItem(23); // 修改id值為23的那筆資料
    // p2.data.author = '林小新2';
    // const obj2 = await p2.save();

    const p3 = await Product.getItem(25);
    res.json([req.baseUrl, req.url, obj1, obj2, await p3.remove()]);
});

// 取得單項商品
router.get('/all', async (req, res)=>{
    // res.json(await Product.getRows({cate:3})); // 測試分類
    res.json(await Event.getRows({keyword:'藝文'})); // 測試關鍵字中有林
});

// 取得單項商品
router.get('/:id', async (req, res)=>{
    res.json(await Event.getRows(2));
});



module.exports = router; 