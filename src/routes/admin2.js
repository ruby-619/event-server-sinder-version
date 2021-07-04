const express = require('express');

const router = express.Router();

router.get('/admin2/:p1?/:p2?', (req, res)=>{
    res.json({
        shinder: express.shinder,
        params: req.params,
        url: req.url,
        baseUrl: req.baseUrl,
    });
});

module.exports = router;