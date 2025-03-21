const Person = require('./Person.js');
// 导入自定义模块，模块名字是自己定义的，模块对象下有导出的方法
const customFunction = require('./customFunction.js');
const p1 = new Person('赵云',36,'男');
p1.showInfo();
p1.setName('赵丽颖');p1.setAge(21);p1.setSex('女');
p1.showInfo();

let result = customFunction.calculateCircleArea(10);
console.log(result);