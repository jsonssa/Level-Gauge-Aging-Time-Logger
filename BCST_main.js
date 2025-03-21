/*****************************************
 
    江苏佰创仪表集团有限公司采集主进程
	
	为保证系统稳定运行，请勿擅自修改！
	
	程序设计：崔华强 版本V1.0
	
*************系统采集初始设定****************/

//注意！！！！！！！！配置这里之前请先在系统里添加完毕所有采集点信息！！！！！！！！！！


// 导入子进程模块
const child_process = require('child_process');

// 如果进程发生了未捕捉的异常，会触发uncaughtException事件。通过监听这个事件，你可以让进程优雅的退出：

process.on('uncaughtException', function(err) {
	console.log(err);
}); //全局变量process 捕捉错误

const child = [];

for(let i=0;i<=3;i++){
	// 启动子进程
	
	child[i] = child_process.fork('数据写入测试.js'); //进程
	
	child[i].on('close', function(code) {
	
		if (Number.parseInt(code) != 0) {
	
			console.log(`进程${i}进程意外退出失联`);
	
		} else {
	
			console.log(`进程${i}已完成任务退出！`);
	
		}
	
	})
}

/*
// 启动子进程
const child1 = child_process.fork('数据写入测试.js'); //进程

child1.on('close', function(code) {

	if (Number.parseInt(code) != 0) {

		console.log('进程1进程意外退出失联');

	} else {

		console.log('进程1已完成任务退出！');

	}

})

// 启动第二个子进程
const child2 = child_process.fork('数据写入测试.js'); //进程

child2.on('close', function(code) {

	if (Number.parseInt(code) != 0) {

		console.log('进程1进程意外退出失联');

	} else {

		console.log('进程1已完成任务退出！');

	}

})
*/
/* 
const SaveData = child_process.fork('saveDatabase.js', [DATA_SAVE_INTERVAL, MODBUS1_DEV_NUM], {
	cwd: 'D:/mqasc/mqasc'
}); //进程 cwd 子进程的当前工作目录。

SaveData.on('close', function(code) {

	if (Number.parseInt(code) != 0) {

		console.log('内存化进程意外退出失联');

		setTimeout(() => {

			SaveData = child_process.fork('saveDatabase.js', [DATA_SAVE_INTERVAL, MODBUS1_DEV_NUM], {
				cwd: 'D:/mqasc/mqasc'
			}); //进程

		}, 1000) //1秒后自动重启持久化子进程


	} else {

		console.log('内存化进程已完成任务退出！');

	}

})
 */
