var express = require('express')
var cors = require('cors') //解决跨域
var app = express();
var port = process.env.PORT || 1124;
const { SerialPort } = require('serialport')

var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '1mb'}));
app.use(express.static('public'));
app.listen(port,function(){
	console.log(`http服务器开始成功,请访问127.0.0.1:${port}`);
})
app.use(cors());
app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html')　
});
app.post('/ledControl/on.do',function (req,res) {
    const str = req.body.data
    if(setContrl(str.split(','))){
        res.send({
            code:100,
            data:'开启成功！',
            message:'信息'
        })
        return
    }
    res.send({
        code:101,
        data:'开启失败！',
        message:'信息'
    })
})

/*
**指令下发
* msg：string ;  eg: '01050000ff008C3A,01050001f000D80A'
* */
function setContrl(msg){
    return new Promise(function (resolve,reject) {
        let recData=[];
        msg.map(function (item, index) {
            //16进制Buffer流
            const str = Buffer.from(item,"hex")
            recData.push(str)
        })
        var i = 0
        eachWrite(recData[i])
        function eachWrite(item) {
            serialPort.write(item, function (error, result) {
                i++
                if(i>=recData.length){
                    resolve(true)
                    return
                }
                //指令是一条一条下发的
                setTimeout(function () {
                    eachWrite(recData[i])
                },1000)
            })
        }

        //错误监听
        serialPort.on('error',function (error) {
            console.log('error: '+error)
            resolve(false)
        })
    })

}

//Opening a Port
var serialPort = new SerialPort({
    path: 'COM7',
    //波特率，可在设备管理器中对应端口的属性中查看
    baudRate : 9600,
    autoOpen:false
})
//连接串口
serialPort.open(function (err) {
    console.log('IsOpen:',serialPort.isOpen)
})
//指令监听
serialPort.on('data',function (data) {
    console.log('data received: '+data)
})

//获取端口列表

SerialPort.list().then((ports) => {
    let paths = ports.map((item)=>{return item.path}).filter((item)=>{return item.indexOf('NULL')==-1});
    paths.forEach((item)=>{
        console.log(`本机端口${item}`);
    })
    //console.log(ports); // 打印串口列表
}).catch((err) => {
    console.log(err);
});