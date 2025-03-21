/*
 *                                                     __----~~~~~~~~~~~------___
 *                                    .  .   ~~//====......          __--~ ~~
 *                    -.            \_|//     |||\\  ~~~~~~::::... /~
 *                 ___-==_       _-~o~  \/    |||  \\            _/~~-
 *         __---~~~.==~||\=_    -_--~/_-~|-   |\\   \\        _/~
 *     _-~~     .=~    |  \\-_    '-~7  /-   /  ||    \      /
 *   .~       .~       |   \\ -_    /  /-   /   ||      \   /
 *  /  ____  /         |     \\ ~-_/  /|- _/   .||       \ /
 *  |~~    ~~|--~~~~--_ \     ~==-/   | \~--===~~        .\
 *           '         ~-|      /|    |-~\~~       __--~~
 *                       |-~~-_/ |    |   ~\_   _-~            /\
 *                            /  \     \__   \/~                \__
 *                        _--~ _/ | .-~~____--~-/                  ~~==.
 *                       ((->/~   '.|||' -_|    ~~-/ ,              . _||
 *                                  -_     ~\      ~~---l__i__i__i--~~_/
 *                                  _-~-__   ~)  \--______________--~~
 *                                //.-~~~-~_--~- |-------~~~~~~~~
 *                                       //.-~~~--\
 *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *                               神兽保佑            永无BUG
 */


// @author 崔华强 [江苏佰创仪表集团有限公司 17321792261]

// 继电器控制板
class ElectricRelay{
    // hexData 继电器16进制的数据报文
    constructor(hexData){
        this.hexData = hexData;
    }

    // @desc checkHexData 作用 检查原始16进制报文
    // @param CRC {object} 传入modbus校验类对象 hexLength {int} 传入报文长度
    // @return {object} success 成功

    checkHexData(CRC,hexLength){
        // 先清空空格，长度判定
        let tempHexData = this.hexData.replace(/\s*/g,"");
        // 继电器长度12
        // console.log(`长度${tempHexData.length}`);
        //  根据电磁流量计的报文长度要确定
         if(tempHexData.length==hexLength){
            // 长度验证完毕，来验证CRC校验
            if(tempHexData.slice(-4).toUpperCase()==CRC.ToModbusCRC16(tempHexData.slice(0,-4), true)){

                return {status:'success',message:datas};

            }else{
                return {status:'error',message:`modbusCRC校验值出错`};
            }
         }else{
                return {status:'error',message:`modbus报文长度出错`};
    
         }  
    }

    pareRelayStatus(datas,HexConver){
        if(datas.status =='success'){
            datas.message
        }

    }

    // swapHex交换字节方法，此方法用于高低字节对调

    swapHex(hexdatas){
        const tempRegex = new RegExp(`([a-fA-F0-9]{${hexdatas.length/2}})`,"gmi");
        return hexdatas.split(tempRegex).reverse().join('');
    }
    // parseHexData方法 作用 根据传入的寄存器数组对原始的16进制报文进行解析
    // 参数registersArray 使用寄存器数组，举例 [{name:'clkss',datatype:'float',numofReg:2},{name:'clksr',datatype:'float',numofReg:2}] mysql数据库字段选JSON
    
    parseHexData(datas,HexConver,registersArray){
        if(datas.status =='success'){
            const tempArray = registersArray.map((item)=>item.numofReg);
        let regexStr="";
        for(let i=0;i<tempArray.length;i++){
            regexStr += `([0-9a-fA-F]{${tempArray[i]*4}})`
        }

        const regex = new RegExp(regexStr,"gmi");
        let result = datas.message.split(regex).filter(item=>item!='');
        let resObj = this.combineData(result,registersArray,HexConver)
        return JSON.stringify(resObj);
        }else{
            return JSON.stringify(datas);
        }
        

    }
    // 根据寄存器拼接数据
    combineData(hexArray,registersArray,HexConver){
        // console.log(hexArray);
        const tempFlowmeter = {};
        for(let i=0;i<registersArray.length;i++){
            if(registersArray[i].datatype =='float'){
                tempFlowmeter[registersArray[i].name] = HexConver.HexToSingle(hexArray[i]).toFixed(2)+(registersArray[i].unit?registersArray[i].unit:'');
            }
            if(registersArray[i].datatype =='long'){
                tempFlowmeter[registersArray[i].name] = HexConver.hex2int(this.swapHex(hexArray[i]))+(registersArray[i].unit?registersArray[i].unit:'')
            }
            if(registersArray[i].datatype =='int'){
                tempFlowmeter[registersArray[i].name] = HexConver.hex2int(hexArray[i])+(registersArray[i].unit?registersArray[i].unit:'')
            }
        }
        return tempFlowmeter;
    }

}
// 电磁流量计类
class EleFlowmeter extends Flowmeter{
    constructor(hexData){
        super(hexData);
    }
}

// 
class EleFlowmeterN1 extends EleFlowmeter{
    constructor(hexData){
        super(hexData);
    }
}

//超声波流量计类
class UltrasonicFlowmeter extends Flowmeter{
    constructor(hexData){
        super(hexData);
    }
    // checkHexData 检查报文长度和CRC校验是否一致，切割出数据报文
    // 返回值 数据报文部分
    checkHexData(CRC,hexLength){
        // 先请空空格，然后根据长度判定
        let tempHexData = this.hexData.replace(/\s*/g,"");

        //  根据电磁流量计的报文长度要确定
         if(tempHexData.length == hexLength){

            if(tempHexData.slice(-4).toUpperCase()==CRC.ToModbusCRC16(tempHexData.slice(0,-4), true)){
                // 定义正则表达式来验证是否符合报文规范
            const regex = /([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{144})([a-fA-F0-9]{4})/gmi;
            // 执行正则，并去掉空值
            let result = tempHexData.split(regex).filter(item=>item!='');
            // 对结果数组进行解构
            let [instrument_id,action_code,datas_length,datas,hexcrc] = result;
            // console.log(result);
            // 拼接输出数据进行测试
            let str = `仪表站号：${instrument_id},功能码：${action_code},报文长度：${datas_length},报文数据：${datas},报文校验：${hexcrc}`;
            // 测试输出
            // console.log(str);
            // 将符合要求的数据字段返回，类型为字符串
            return {status:'success',message:datas};

            }else{
                return {status:'error',message:`modbusCRC校验值出错`};
            }
         }else{
                return {status:'error',message:`modbus报文长度出错`};
    
         }  
        
    }
    // 交换字节函数，此函数用于高低字节对调
    swapHex(hexdatas){
        return hexdatas.split(/([a-fA-F0-9]{4})/).reverse().join('');
    }

    // parseHexData方法 描述 根据返回的数据字符串切割数据
    // 参数 datas 原始数据报文 HexToSingle 16进制转单精度浮点数函数,NumberDecimalPlaces 小数点位数
    // 返回值 JSON对象
    parseHexData(token,datas,HexConver,NumberDecimalPlaces){
        
        if(datas.status =='success'){
            // 根据数据截取
            const regex = /([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})([a-fA-F0-9]{8})/gmi;
            let result = datas.message.split(regex).filter(item=>item!='');
            // 定义要输出的对象
            let eleFlowmeter ={};
            //  注册码
            eleFlowmeter.clkToken = token;
            // 瞬时流量 clkss CDAB排序
            eleFlowmeter.clkss = parseFloat(HexConver.HexToSingle(swapHex(result[0]))).toFixed(NumberDecimalPlaces);
            // 瞬时热量 clksr
            eleFlowmeter.clksr = parseFloat(HexConver.HexToSingle(swapHex(result[1]))).toFixed(NumberDecimalPlaces);
            // 流体速度 clkls
            eleFlowmeter.clkls = parseFloat(HexConver.HexToSingle(swapHex(result[2]))).toFixed(NumberDecimalPlaces);
            // 正累积  clkll
            eleFlowmeter.clkll = HexConver.hex2int(swapHex(result[4]));
            // 正累积热量 clkllr
            eleFlowmeter.clkllr = HexConver.hex2int(swapHex(result[8]));
            // 进水温度
            eleFlowmeter.clkA = parseFloat(HexConver.HexToSingle(swapHex(result[16]))).toFixed(NumberDecimalPlaces);
            // 回水温度
            eleFlowmeter.clkB = parseFloat(HexConver.HexToSingle(swapHex(result[17]))).toFixed(NumberDecimalPlaces);
            return JSON.stringify(eleFlowmeter); 
            // return eleFlowmeter; 
        }else{
            return JSON.stringify(datas);
        }
        
    }
}
exports.Flowmeter = Flowmeter;
exports.EleFlowmeter = EleFlowmeter;
exports.UltrasonicFlowmeter = UltrasonicFlowmeter;
exports.EleFlowmeterN1 = EleFlowmeterN1;
// 整体导出
// module.exports = {Flowmeter,Eleflowmeter,UltrasonicFlowmeter}