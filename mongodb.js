// 建立一个客户端链接


var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/runoob';
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log('数据库已创建');
    var dbase = db.db("runoob");
	// 创建集合完成
/*    dbase.createCollection('site', function (err, res) {
        if (err) throw err;
        console.log("创建集合!");
        db.close();
    }); */
	// 插入一条数据
/* 	    var myobj = { name: "菜鸟教程", url: "www.runoob" };
	    dbase.collection("site").insertOne(myobj, function(err, res) {
	        if (err) throw err;
	        console.log("文档插入成功");
	        db.close();
	    }); */
		// 插入多条数据
/* 		var myobj =  [
		        { name: '菜鸟工具', url: 'https://c.runoob.com', type: 'cn'},
		        { name: 'Google', url: 'https://www.google.com', type: 'en'},
		        { name: 'Facebook', url: 'https://www.google.com', type: 'en'}
		       ];
		    dbase.collection("site").insertMany(myobj, function(err, res) {
		        if (err) throw err;
		        console.log("插入的文档数量为: " + res.insertedCount);
		        db.close();
		    }); */
			
			// 查找数据
			    // dbase.collection("site"). find({}).toArray(function(err, result) { // 返回集合中所有数据
				dbase.collection("site").find({name: /.*菜鸟.*/i}).toArray(function(err, result) {
				
			        if (err) throw err;
			        console.log(result,result.length);
			        db.close();
			    });
});



/* // 官方手册的示例 这个示例是5.0最新版本
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'jiechuang';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('documents');

  // the following code examples can be pasted here...

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close()); */
 