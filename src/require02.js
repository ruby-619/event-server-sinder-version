const Person = require(__dirname + '/Person');


const p2 = new Person('Andy', 25);

console.log(p2);
console.log('' + p2);
console.log(JSON.stringify(p2));
