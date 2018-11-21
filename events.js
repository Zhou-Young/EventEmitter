// 首先初始化EventEmitter，赋值为null
function EventEmitter() {
  this._events = Object.create(null)   // {type: [...callback],type:[])
}

// 默认最大监听数为10个
EventEmitter.defaultMaxListeners = 10;

// 当然你也可以改了   不能用箭头函数，不然this就绑定到windows上去了
EventEmitter.prototype.setMaxListeners = function(count) {
  this._count = count;
  return this._count;
}

// 能设能改当然可以读取了
EventEmitter.prototype.getMaxListeners = function() {
  return this._count || EventEmitter.defaultMaxListeners;
}

// addListener(event, callback)
// 为指定事件添加一个监听器到监听器数组的尾部。
// on(event, callback)
// 为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
EventEmitter.prototype.on = EventEmitter.prototype.addListener = function(event, callback, flag) {
  // 如果不存在event，就赋个初值
  if (!this._events) {
    this._events = Object.create(null)
  }

  // newListener监听是否加了新的监听
  if (this._events['newListener'] && this._events['newListener'].length && event !== 'newListener') {
      this._events['newListener'].forEach(fn => fn(event));
  }

  // 如果已存在就在数组里面加，如果不存在就赋值
  if(this._events[event]){
    // 为prependListener做准备
    if(flag) {
      this._events[event].unshift(callback);
    } else {
      this._events[event].push(callback)
    }
  }else{
    this._events[event]=[callback];
  }

  // 如果超出最大监听数，就报错
  let maxListeners = this.getMaxListeners();
  if(this._events.length > maxListeners) {
    console.error(`MaxListenersExceededWarning: ${maxListeners + 1} ${event} listeners added`);
  }
}

// prependListener 方法
// 添加事件监听，从数组的前面追加
EventEmitter.prototype.prependListener = function (type, callback) {
  // 第三个参数为 true 表示从 _events 对应事件类型的数组前面添加 callback
  // 对，第三个参数就是为他服务的
  this.on(type, callback, true);
}

// removeListener(event, callback)
// 移除指定事件的某个监听器，监听器必须是该事件已经注册过的监听器。
EventEmitter.prototype.removeListener=function(event, callback) {
  !!this._events[event] && (this._events[event] = this._events[event].filter(fn=>{
    // 如果是once就是realcallback
    return fn !== callback && fn !== callback.realCallback;
  }));
}

// removeAllListeners([event])
// 移除所有事件的所有监听器， 如果指定事件，则移除指定事件的所有监听器。
EventEmitter.prototype.removeAllListeners=function(event, callback) {
  //不传值默认清空所有，传值只清空这个事件，，为什么不直接删掉
  if (event) {
    this._events[event] = [];
  } else {
      this._events = Object.create(null);
  }
}

// once(event, callback)
// 为指定事件注册一个单次监听器，即 监听器最多只会触发一次，触发后立刻解除该监听器。
EventEmitter.prototype.once = function (event, callback, flag) {
  // 执行完监听之后就删掉这个监听
  let wrap = (...args) => {
    callback(...args);
    // 删除这个事件的这个监听，，不是删除整个事件。。
    this.removeListener(event,wrap);
  }
  // 存储 callback，确保单独使用 removeListener 删除传入的 callback 时可以被删除掉
  wrap.realCallback = callback;

  // 添加事件监听
  this.on(event, wrap, flag);
}

// prependOnceListener(event, callback)
// 添加事件监听，从数组的前面追加，只执行一次
EventEmitter.prototype.prependOnceListener = function (type, callback) {
  this.once(type, callback, true);
}


// listeners(event)
// 返回指定事件的监听器数组。
EventEmitter.prototype.listeners = function (event) {
  // 返回这个数组
  return this._events[event];
}

// emit(event, [arg1], [arg2], [...])   arg可以给回调函数传参
// 按参数的顺序执行每个监听器，如果事件有注册监听返回 true，否则返回 false。
EventEmitter.prototype.emit = function (event, ...args) {
  if (this._events[event]) {
      // 执行这个事件的所有监听  this指向监听
      this._events[event].forEach(fn => fn.call(this, ...args));
  }
}

// eventNames 方法
// 获取监听的所有事件类型
EventEmitter.prototype.eventNames = function () {
  // 返回这个对象的key
  return Object.keys(this._events);
}

module.exports = EventEmitter;