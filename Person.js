function Person(name,age,sex){
	this.name = name;
	this.age = age;
	this.sex = sex;
}
Person.prototype.showInfo = function(){
	console.log(`人员姓名：${this.name},年龄：${this.age},性别:${this.sex}`)
}
Person.prototype.setName = function(name){
	this.name = name;
}
Person.prototype.setAge = function(age){
	this.age = age;
}
Person.prototype.setSex = function(sex){
	this.sex = sex;
}

module.exports = Person;