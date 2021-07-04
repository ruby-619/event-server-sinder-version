const http = require('http');
const fs = require('fs');

const server = http.createServer(async (req, res)=>{
    try{
        await fs.promises.writeFile(__dirname + '/headers02.txt', JSON.stringify(req.headers) );
        res.end('ok !');
    } catch(ex){
        res.end('error: ' + ex);
    }
});

server.listen(3000); // port number 埠號





