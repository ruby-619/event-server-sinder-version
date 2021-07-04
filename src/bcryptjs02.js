const bcrypt = require('bcryptjs');

const hash = '$2a$10$qyXQzVCGgqGfIlXQndYXR.3tcPTfYatyOaCiu.KD3.qRjAOqRgHEC';

bcrypt.compare('123456', hash)
    .then(result=>{
        console.log(result);
    });
