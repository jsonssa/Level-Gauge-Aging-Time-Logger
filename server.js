const { SerialPort } = require('serialport')
//Opening a Port
var serialPort = new SerialPort({
    path: 'COM7',
    //波特率，可在设备管理器中对应端口的属性中查看
    baudRate : 9600,
    autoOpen:false
})
//连接串口，写入指令操作
serialPort.open(function (err) {
    console.log('IsOpen:',serialPort.isOpen)
    console.log('err:',err)
    if(!err){
        //16进制Buffer流
        const buf1 = Buffer.from("01050000ff008C3A","hex") //打开红灯
        const buf11 = Buffer.from("010500000000CDCA","hex") //关闭红灯
        const buf2 = Buffer.from("01050001f000D80A","hex") //打开黄灯
        const buf21 = Buffer.from("0105000100009C0A","hex") //关闭黄灯
        const buf3 = Buffer.from("01050002f000280A","hex") //打开绿灯
        const buf31 = Buffer.from("0105000200006C0A","hex") //关闭绿灯
        const bufs = [buf1,buf2,buf3]
        // const bufs = [buf11,buf21,buf31]
        var i = 0
        eachWrite(bufs[i])
        function eachWrite(item) {
            console.log(item)
            serialPort.write(item, function (error, result) {
                i++
                if(i>=bufs.length)return
                //指令是一条一条下发的
                setTimeout(function () {
                    eachWrite(bufs[i])
                },40)
            })
        }
    }
})
//指令监听
serialPort.on('data',function (data) {
    console.log('data received: '+data)
})
//错误监听
serialPort.on('error',function (error) {
    console.log('error: '+error)
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