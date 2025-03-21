var express = require('express')
var cors = require('cors') //解决跨域
var app = express();
var port = process.env.PORT || 1124;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '1mb'}));
app.use(express.static('public'));
app.listen(port,function(){
	console.log(`http服务器开始成功,请访问127.0.0.1:${port}`);
})
app.use(cors());
app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
});

app.get('/main', (req, res) => {
  res.sendFile(__dirname+'/main.html');
});
