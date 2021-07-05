
require('dotenv').config();
const port = process.env.PORT || 3000;
const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const db = require(__dirname + '/modules/mysql2-connect');
const sessionStore = new MysqlStore({}, db);
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

express.shinder = '小新';

// const multer = require('multer');
// const upload = multer({dest: 'tmp_uploads/'}); // 設定暫存的資料夾
// const {v4: uuidv4} = require('uuid');
const upload = require(__dirname + '/modules/upload-img');

const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');

const corsOptions = {
    credentials: true,
    origin: function(origin, cb){
        cb(null, true);
    }
};
app.use(cors(corsOptions));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'kre94865790lkglkdjflkdfghlsrhddk',
    store: sessionStore,
    cookie: {
        maxAge: 1200000,
    }
}));
app.use(express.urlencoded({extended: false}));  // middleware // 中介軟體
app.use(express.json()); 
// app.use(express.static('public'));
app.use(express.static(__dirname + '/../public'));

app.use((req, res, next)=>{
    // res.locals = {
    //     email: '全域的 middleware: email',
    //     password: '全域的 middleware: password',
    // };
    res.locals.admin = req.session.admin || {};  // 把登入的管理者資料放到 locals

    req.bearer = null;  // 自訂屬性
    let auth = req.get('Authorization');
    if(auth && auth.indexOf('Bearer ')===0){
        auth = auth.slice(7);
        try {
            req.bearer = jwt.verify(auth, process.env.TOKEN_SECRET);
        } catch(ex){
            req.bearer = false;
            console.log(ex);
        }
    }
    next();
});



// 路由定義：開始


app.get('/', (req, res)=>{
    res.render('home', {name: 'Shinder'});
});

app.get('/json-test', (req, res)=>{
    const d = require(__dirname + '/../data/sales');
    // res.json(d);
    res.render('json-test', {sales: d});
});

app.get('/try-qs', (req, res)=>{
    res.json(req.query);
});


app.post('/try-post', (req, res)=>{
    res.json(req.body);
});

app.get('/try-post-form', (req, res)=>{
    // res.locals = {
    //     email: '這是預設 email',
    //     password: '這是預設 password',
    // }
    res.render('try-post-form');
});
app.post('/try-post-form', (req, res)=>{
    res.render('try-post-form', req.body);
});

app.get('/try-upload',  (req, res)=>{
    res.render('try-upload');
});
app.post('/try-upload', upload.single('avatar'), async (req, res)=>{
    console.log(req.file);

    // let newName = '';
    // if(extMap[req.file.mimetype]){
    //     newName = uuidv4() + extMap[req.file.mimetype];
    //     await fs.promises.rename(req.file.path, './public/img/' + newName);
    // }

    res.json({
        filename: req.file && req.file.filename,
        body: req.body,
    });
});

app.post('/try-uploads', upload.array('photo', 6), (req, res)=>{
    console.log(req.files);
    res.json({
        files: req.files,
        body: req.body,
    });
});

app.get('/pending',  (req, res)=>{

});

app.get('/my-params1/:action?/:id?', (req, res)=>{
    res.json(req.params);
});

app.get(/\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res)=>{
    //res.send(req.url);
    let u = req.url.slice(3); // 去除 /m/
    u = u.split('?')[0]; // 去除 query string
    u = u.replace(/-/g, ''); // 去除 -
    // u = u.split('-').join(''); // 去除 -
    res.send(`<h2>${u}</h2>`);
});

// app.use( require(__dirname + '/routes/admin2') );
const admin2 = require(__dirname + '/routes/admin2');
app.use('/admin3', admin2);
app.use(admin2);

app.get('/try-sess', (req, res)=>{
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var ++;
    res.json({
        my_var: req.session.my_var,
        session: req.session,
    });
});

app.get('/login', (req, res)=>{
    if(req.session.admin){
        res.redirect('/');  // 若是已登入，轉向到首頁
    } else {
        res.render('login');
    }
});
app.post('/login', async (req, res)=>{

    const output = {
        success: false,
        code: 0,
        error: '沒有 account 或沒有 password 欄位',
        body: req.body,
    };

    if(!req.body.account || !req.body.password){
        return res.json(output);
    }

    const [ members ] = await db.query("SELECT * FROM members WHERE `email`=?", [req.body.account]);

    if(! members.length) {
        output.code = 401;
        output.error = "帳號或密碼錯誤(沒有此帳號)";
        return res.json(output);
    }

    const member = members[0];

    const result = await bcrypt.compare(req.body.password, member.password);
    if(! result) {
        output.code = 405;
        output.error = "帳號或密碼錯誤(密碼錯誤)";
        return res.json(output);
    }

    const {id, email, nickname} = member;
    // req.session.member = {id, email, nickname};  // 使用 session

    // output.token = jwt.sign({id, email, nickname}, process.env.TOKEN_SECRET,{ expiresIn: '180000'}); // 三分鐘過期
    output.token = jwt.sign({id, email, nickname}, process.env.TOKEN_SECRET);
    output.success = true;
    output.error = '';
    output.code = 200;

    res.json(output);
});
app.get('/logout', (req, res)=>{
    delete req.session.member;
    res.redirect('/');
});
app.post('/jwt-verify', (req, res)=>{
    let payload;
    try {
        payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
        return res.json(payload);
    } catch(ex) {
        return res.json({
            error: ex.toString()
        });
    }
});
app.get('/headers', (req, res)=>{
    res.json({
        headers: req.headers,
        bearer: req.bearer,
    });
});


const moment = require('moment-timezone');
app.get('/try-moment', (req, res)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const m1 = moment(new Date());
    const m2 = moment('2021-03-15');

    res.json({
        t1: m1.format(fm),
        t1a: m1.tz('Europe/London').format(fm),
        t2: m2.format(fm),
        t2a: m2.tz('Europe/London').format(fm),
    });
});

app.get('/try-db', (req, res)=>{
    db.query('SELECT * FROM `address_book` LIMIT 5')
        .then(([r])=>{
            res.json(r);
        })
        .catch(error=>{
            res.send(error);
        });
});

app.use('/address-book', require(__dirname + '/routes/address-book'));
app.use('/event', require(__dirname + '/routes/event'));
app.use('/cart', require(__dirname + '/routes/cart'));




// 404 放在所有的路由後面
app.use((req, res)=>{
    res.type('text/html');
    res.status(404).send('<h1>找不到頁面</h1>');
});
// 路由定義：結束

app.listen(port, ()=>{
    console.log(`server started: ${port}`);
});






