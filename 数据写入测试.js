const moment = require('moment');
const mongoose = require('mongoose');
// const DB_URL = 'mongodb://127.0.0.1:27017/test2';
const DB_URL = 'mongodb://root:Bcst123456@101.32.213.204:27017/flowmeters?authSource=admin';
// var DB_URL = 'mongodb://localhost:27017/dataDb';

// 屏蔽警告信息
mongoose.set('strictQuery', true);
/* 链接数据库 */
mongoose.connect(DB_URL);

/* 链接成功 */
mongoose.connection.on('connected', function() {
	console.log('Mongoose connection open to ' + DB_URL);
});

// 链接异常
mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error:' + err);
});

// 链接断开

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose connection disconnected');
});

// 设定数据类型
const flowmeterSchema = new mongoose.Schema({
	instrumentSerialNumber: {
		type: String
	}, //仪表序号
	flowmeterName: {
		type: String
	}, // 流量计名称
	instantaneousFlow: {
		type: Number
	}, // 瞬时流量
	cumulativeFlow: {
		type: Number
	}, // 累积流量
	acquisitionTime: {
		type: String,
		default: () => moment().format('YYYY-MM-DD HH:mm:ss')
	}, //采集时间
	alarmStatus: {
		type: String,
		default: ''
	},
	instantaneousFlowUnit: {
		type: String,
		default: 'm³/h'
	},
	cumulativeFlowUnit: {
		type: String,
		default: 'm³'
	},
}, {
	versionKey: false
});
// 每一个实例化后的model实际上就是一个文档，可以实现对数据库的操作
// mongoose.model(参数1,参数2，参数3);
// 参数1 ： modelName —— 映射数据库中的集合名;
// 参数2 ： Schema —— 创建Schema的对象名;
// 参数3 ： 可选,代表数据库集合名;设置了会与第三参数的集合建立连接操作该集合，反之则会与（参数1 + s ）建立连接;

const Flowmeter = mongoose.model('flowmeters', flowmeterSchema);
// 生成随机整数
function RandomNumBoth(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Math.round(Rand * Range); //四舍五入
	return num;
}
// 生成指定的字符串整数
function randomNum(n) {
	var res = "";
	for (var i = 0; i < n; i++) {
		res += Math.floor(Math.random() * 10);
	}
	return res;
}
// 向mongodb数据库写入数据
async function addFlowmetersInfo() {
	try{
		// 生成随机小数
		let random1 = Math.random() * (1500 - 10) + 10;
		let random2 = RandomNumBoth(100, 90000);
		let random3 = randomNum(3);
		const urls = ['电磁流量计', '超声波流量计', '涡街流量计', '涡轮流量计', '孔板流量计', '平衡流量计']
		let flowmeter = new Flowmeter({
			instrumentSerialNumber: random3, //仪表序号
			flowmeterName: urls[Math.floor((Math.random() * urls.length))], // 流量计名称
			instantaneousFlow: random1.toFixed(2), // 瞬时流量
			cumulativeFlow: random2 // 累积流量
		})
		additionalUnit(flowmeter);
		let res = await flowmeter.save();
		console.log(res);
		setTimeout(addFlowmetersInfo, 1000)
	}catch(e){
		console.log(e)
	}
	
}
addFlowmetersInfo();

function additionalUnit(object) {
	// object.instrumentSerialNumber = `仪表序号${object.instrumentSerialNumber}`
	object.instantaneousFlow > 1000 ? object.alarmStatus = '瞬时超限' : object.alarmStatus = '瞬时正常';
}
