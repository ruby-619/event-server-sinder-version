const express = require('express');
const moment = require('moment-timezone');
const db = require(__dirname + '/../modules/mysql2-connect');
const upload = require(__dirname + '/../modules/upload-img');

const router = express.Router();

const getListData = async (req)=>{
    let output = {
        success: false,
        error: '',
        totalRows: 0,
        totalPages: 0,
        page: 0,
        rows: [],
    };

    let page = req.query.page || 1;
    page = parseInt(page);

    let t_sql = "SELECT COUNT(2) num FROM `address_book` ";
    let [r1] = await db.query(t_sql);
    const perPage = 5; // 每頁要呈現幾筆資料
    const totalRows = r1[0].num; // 資料表的總筆數

    const totalPages = Math.ceil(totalRows/perPage); // 總共有幾頁

    let rows = []; // 某分頁的資料預設為空的
    if(totalRows > 0) {
        if(page < 1){
            output.error = 'page 值太小';
            return output;
        }
        if(page > totalPages){
            output.error = 'page 值太大';
            return output;
        }
        const sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(page-1)*perPage}, ${perPage}`;

        [rows] = await db.query(sql);
        rows.forEach(el=>{
            el.birthday = moment(el.birthday).format('YYYY-MM-DD')
        });
    }
    if(! output.error){
        output = {
            success: true,
            error: null,
            totalRows,
            totalPages,
            page,
            rows,
        };
    }
    return output;
};

router.get('/list', async (req, res)=>{
    const output = await getListData(req);

    if(output.error){
        return res.redirect(req.baseUrl + req.url.split('?')[0]);
    }
    res.render('address-book/list',output);
});

router.get('/list2', (req, res)=>{
    res.render('address-book/list2');
});

router.get('/api/list', async (req, res)=>{
    res.json(await getListData(req));
});

router.get('/add', async (req, res)=>{
    res.render('address-book/add2');
});
/*
router.post('/add', async (req, res)=>{
    const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";

    const [results] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday,
        req.body.address,
    ]);

    res.json({
        body: req.body,
        results
    });
});
 */
router.post('/add', upload.none(), async (req, res)=>{
    // TODO: 輸入的資料檢查

    let output = {
        success: false,
        error: '',
        insertId: 0
    };

    const data = {
        ...req.body,
        created_at: new Date()
    }
    const sql = "INSERT INTO `address_book` SET ?";
    const [results] = await db.query(sql, [ data ]);

    if(results.affectedRows===1){
        output.success = true;
        output.insertId = results.insertId;
    } else {
        output.error = '資料新增失敗';
    }

    output = {...output, body: req.body};
    res.json(output);
});

router.get('/del/:sid', async (req, res)=>{
    // return res.json([req.get('Referer'), req.headers]); // 測試查看 Referer

    const sql = "DELETE FROM `address_book` WHERE sid=?";
    await db.query(sql, [req.params.sid]);

    if(req.get('Referer')){
        res.redirect( req.get('Referer') );
    } else {
        res.redirect('/address-book/list');
    }
});

router.get('/edit/:sid', async (req, res)=>{
    const sql = "SELECT * FROM address_book WHERE sid=?";
    const [rs] = await db.query(sql, [req.params.sid]);

    // 如果沒有找到資料就轉向到列表頁
    if(! rs.length){
        return res.redirect('/address-book/list');
    }
    rs[0].birthday = moment(rs[0].birthday).format('YYYY-MM-DD')
    res.render('address-book/edit', rs[0]);
});
router.post('/edit/:sid', upload.none(), async (req, res)=>{
    let output = {
        success: false,
        type: 'danger',
        error: '',
        results: {},
    };
    const sql = "UPDATE `address_book` SET ? WHERE sid=?";
    const [results] = await db.query(sql, [req.body, req.params.sid]);
    output.results = results;
    if(results.affectedRows && results.changedRows){
        output.success = true;
        output.type = 'success';
    } else if(results.affectedRows){
        output.error = '資料沒有修改';
        output.type = 'warning';
    } else {
        output.error = '資料修改發生錯誤';
    }
    res.json(output);
});


router.get('/escape', async (req, res)=>{
    const str = "ab'c";
    res.send(db.escape(str)); // 做單引號跳脫，同時用單引號包裹
});


module.exports = router;