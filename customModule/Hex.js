const HEX = {};
/*** @param {Object} 
 * buffer* ArrayBuffer转16进制字符串
 * */
HEX.ab2hex = function(buffer)
{
    const hexArr = Array.prototype.map.call(new Uint8Array(buffer),function(bit)
    {
        return ('00' + bit.toString(16)).slice(-2)
    });
    return hexArr.join('');
};

//int转hex
HEX.intTohex = function(data, len)
{
    // console.log(data);
    len = len * 2;
    var retVal = data.toString(16);
    //console.log(retVal);
    if (retVal.length > len) return retVal;
    var length = retVal.length;
    for (var i = 0; i < len - length; i++)
    {
        retVal = '0' + retVal;
    }
    return retVal;
};
//需要用到的函数
HEX.InsertString = function(t, c, n)
{
    var r = new Array();
    for (var i = 0; i * 2 < t.length; i++) 
    {
        r.push(t.substr(i * 2, n));
    }
    return r.join(c);
};
//需要用到的函数
HEX.FillString = function(t, c, n, b)
{
    if ((t == "") || (c.length != 1) || (n <= t.length)) 
    {
        return t;
    }
    var l = t.length;
    for (var i = 0; i < n - l; i++)
    {
        if (b == true) 
        {
            t = c + t;
        } else {
            t += c;
        }
    }
    return t;
};
//16进制转双精度浮点数
HEX.HexToDouble = function(temp)
{
    let ret='';
    for(let i=0;i<temp.length;i=i+2)
    {
        ret=temp.substr(i,2)+ret;
    }
    temp=ret;
    let S_Bin = ""; 
    //转化后的二进制字符串
    for (let i = 0; i < temp.length; i++)
    {
        let temp1 = temp.charAt(i);
        S_Bin = S_Bin + HEX.charToBin(temp1);
    }
    let sign = 0; //符号位    
    if (S_Bin.charAt(0) == '1') 
    {
        sign = 1;
    }
    let exponent = "";
    for (let i = 1; i < 12; i++)
    {
        if (S_Bin.charAt(i) == '1')
        {
            exponent = exponent + '1';
        } 
        elseexponent = exponent + '0';
    }
    let exponent_double = 0; //阶码
    exponent_double = HEX.stringToDouble(exponent);
    exponent_double = exponent_double - 1023;
    let mantissa_temp = "";
    for (let i = 12; i < 64; i++)
    {
        if (S_Bin.charAt(i) == '1')
        {
            mantissa_temp = mantissa_temp + '1';
        } 
        elsemantissa_temp = mantissa_temp + '0';
    }
    let mantissa = 0;
    mantissa = HEX.BenToDex(mantissa_temp);
    mantissa = mantissa + 1.0;
    let res = 0;
    let a, c;
    a = Math.pow((-1), sign);
    c = Math.pow(2, exponent_double);
    res = a * mantissa * c;
    return res;
};
HEX.charToBin = function(temp)
{
    return HEX.FillString(parseInt(temp, 16).toString(2), '0', 4, true);
};
HEX.stringToDouble = function(temp)
{
    let res = 0;
    for (let i = 0; i < temp.length; i++)
    {
        res = res * 2 + (temp[i] - '0');
    }
    return res;
};
HEX.BenToDex = function(temp)
{
    let m = temp.length;
    let res = 0;
    for (let i = 0; i < m; i++)
    {
        res = res + (temp[i] - '0') * Math.pow(2, -i - 1);
    }
    return res;
};
//16进制转单精度浮点数
HEX.HexToSingle = function(t)
{
    t = t.replace(/\s+/g, "");
    if (t == "")
    {
        return 0;
    }
    if(t == "00000000")
    {
        return 0;
    }
    if((t.length > 8) || (isNaN(parseInt(t, 16))))
    {
        return "Error";
    }
    if (t.length < 8)
    {
        t = HEX.FillString(t, "0", 8, true);
    }
    t = parseInt(t, 16).toString(2);
    t = HEX.FillString(t, "0", 32, true);
    var s = t.substring(0, 1);
    var e = t.substring(1, 9);
    var m = t.substring(9);
    e = parseInt(e, 2) - 127;
    m = "1" + m;
    if (e >= 0)
    {
        m = m.substr(0, e + 1) + "." + m.substring(e + 1)
    } else {
        m = "0." + HEX.FillString(m, "0", m.length - e - 1, true)
    }
    if (m.indexOf(".") == -1)
    {
        m = m + ".0";
    }
    var a = m.split(".");
    var mi = parseInt(a[0], 2);
    var mf = 0;
    for (var i = 0; i < a[1].length; i++)
    {
        mf += parseFloat(a[1].charAt(i)) * Math.pow(2, -(i + 1));
    }
    m = parseInt(mi) + parseFloat(mf);
    if (s == 1){
        m = 0 - m;
    }
    return m;
};
//浮点数转16进制
HEX.SingleToHex = function(t)
{
    if (t == ""){
        return "";
    }
    //console.log(t);
    t = parseFloat(t);
    //console.log(t);
    if (isNaN(t) == true)
    {
        return "Error";}if (t == 0)
        {
            return "00000000";
        }
        var s,e,m;
        if (t > 0) {
            s = 0;
        }else{
            s = 1;t = 0 - t;
        }
        m = t.toString(2);
        if (m >= 1){
            if (m.indexOf(".") == -1)
            {
                m = m + ".0";
            }
            e = m.indexOf(".") - 1;
        }else{
            e = 1 - m.indexOf("1");
        }
        if (e >= 0){
            m = m.replace(".", "");
        }else{
            m = m.substring(m.indexOf("1"));
        }
        if (m.length > 24){
            m = m.substr(0, 24);
        }else{
            m = HEX.FillString(m, "0", 24, false)
        }
        m = m.substring(1);
        e = (e + 127).toString(2);
        e = HEX.FillString(e, "0", 8, true);
        var r = parseInt(s + e + m, 2).toString(16);
        r = HEX.FillString(r, "0", 8, true);
        return HEX.InsertString(r, "", 2).toUpperCase();
};
HEX.stringToHex = function(str)
{
    var val = "";
    for (var i = 0; i < str.length; i++) 
    {
        if (val == ""){ 
            val = str.charCodeAt(i).toString(16);
        }else{
            val += str.charCodeAt(i).toString(16);
        } 
    }
    return val;
};
HEX.hexToString = function(hexCharCodeStr) 
{
    var trimedStr = hexCharCodeStr.trim();
    var rawStr =trimedStr.substr(0, 2).toLowerCase() === "0x" ?trimedStr.substr(2) :trimedStr;
    var len = rawStr.length;
    if (len % 2 !== 0) 
    {
        alert("Illegal Format ASCII Code!");
        return "";
    }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2)
    {
        if (rawStr.substr(i, 2) == '00')
        {
            resultStr.push('');
        } else {
            curCharCode = parseInt(rawStr.substr(i, 2), 16); 
            // ASCII Code Value
            resultStr.push(String.fromCharCode(curCharCode));
        }
    }
    return resultStr.join("");
};
HEX.add0 = function(m) 
{
    return m < 10 ? '0' + m : m
};

module.exports = HEX;