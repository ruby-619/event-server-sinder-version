const jwtData = JSON.parse(localStorage.getItem('jwtTest'));

function send(){
    fetch('/address-book/verify2',{
        headers: {
            Authorization: 'Bearer ' + jwtData.token
        }
    })
        .then(r=>r.json())
        .then(obj=>{
            console.log(obj);
        })
}

//

app.use((req, res, next)=>{
    res.locals.sess = req.session;

    let auth = req.get('Authorization');

    if(auth && auth.indexOf('Bearer ')===0){
        auth = auth.slice(7);
        jwt.verify(auth, process.env.TOKEN_SECRET, function(error, payload){
            if(!error){
                req.bearer = payload;
            }
            next();
        });
    } else {
        next();
    }
})