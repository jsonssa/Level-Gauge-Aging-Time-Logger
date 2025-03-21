const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
 // 数据操作异步函数
async function dataOperate() {
    var conn = null;
		
    try {
        conn = await MongoClient.connect(url);
        console.log("数据库已连接");
        const test = conn.db("testdb").collection("test");
        // 增加一条
        await test.insertOne({ "site": "runoob.com" });
		// 增加多条
		await test.insertMany([
		        { name: '菜鸟工具', url: 'https://c.runoob.com', type: 'cn'},
		        { name: 'Google', url: 'https://www.google.com', type: 'en'},
		        { name: 'Facebook', url: 'https://www.google.com', type: 'en'}
		       ]);
        // 查询多条
        var arr = await test.find().toArray();
        console.log(arr);
        // 更改
        await test.updateMany({ "site": "runoob.com" },
            { $set: { "site": "example.com" } });
        // 查询
        arr = await test.find().toArray();
        console.log(arr);
		// 查询一条
		arr = await test.findOne();
		console.log(arr);
        // 删除
        await test.deleteMany({ "site": "example.com" });
        // 查询
        arr = await test.find().toArray();
        console.log(arr);
    } catch (err) {
        console.log("错误：" + err.message);
    } finally {
        if (conn != null) conn.close();
    }
}
 
dataOperate();