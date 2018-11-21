// 引入依赖
const EventEmitter = require('./events');
const util = require('util');

function Girl() {}

console.log(EventEmitter.defaultMaxListeners);

// 使 Girl 继承 EventEmitter
util.inherits(Girl, EventEmitter);

// 创建 Girl 的实例
let girl = new Girl();

// 获取事件最大监听个数
console.log(girl.getMaxListeners()); // 10

// 设置事件最大监听个数
girl.setMaxListeners(2);
console.log(girl.getMaxListeners()); // 2


girl.on('失恋', () => console.log('哭了'));
girl.on('失恋', () => console.log('喝酒'));

girl.emit('失恋');

// 哭了
// 喝酒
