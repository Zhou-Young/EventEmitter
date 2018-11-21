# EventEmitter

### this指向问题

普通的this：总是代表它的直接调用者,没找到直接调用者,则this指的是 window(匿名函数,定时器中的函数,由于没有默认的宿主对象,所以默认this指向window)。

箭头函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象，箭头函数中没有自己的this的，而箭头函数会默认使用父级的this。


例如

```
function Foo() {
  this.name = 'z';
  console.log('this', this)
}

Foo.prototype.get = function() {
  console.log(this);
}

var f1 = new Foo();  // this: Foo {name: "z"}

f1.name // z

f1.get();  // Foo {name: "z"}

Foo();   //this: window

var obj = {
  x:10,
  fn:function(){
    console.log('this: ',this);
  }
}

obj.fn();   //this: {x: 10, fn: ƒ}

var f1 = obj.fn;     f1();   // this: window

let person1 = {
    name:'lisi',
    age:10,
    say:function(){
        //这里是外部作用域 ，this指向person1,即箭头函数中的this指向person1
        setTimeout(() => {
            console.log(this);  //this指向父级this
        });
    }
}
person1.say();  //输出person1对象


```
