const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res)=>{

    fs.writeFile(
        __dirname + '/headers01.txt',
        JSON.stringify(req.headers),
        error => {
            if(error){
                res.end(error);
            } else {
                res.end('ok');
            }

        }
    );

});

server.listen(3000); // port number 埠號





