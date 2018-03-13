const express = require('express')
const multer = require('multer')
const app = express()
<<<<<<< HEAD
var net = require('net');
var client = new net.Socket();

const {rServerConnection, callbacks} = require('./rServerClient')

var rServerConn = new rServerConnection()

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './yiy')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })

app.use(express.static('./static'))
app.use(express.static('./views'))

client.connect(6011, '127.0.0.1', function() {
	console.log('Connected');
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/login.html')
})

app.get('/register', (req, res) => {
	res.sendFile(__dirname + '/views/register.html')
})

app.get('/main', (req, res) => {
	res.sendFile(__dirname + '/views/main.html')
})

app.post('/upload', upload.single("yiy"), (req, res) => {
	res.end("Successfully Upload")
})

app.get('/wenzhen', (req, res) => {
	let retData = []
	for (bh in req.query) {
		if (req.query[bh] !== '') {
			retData.push(req.query[bh])
		}
	}
  let msg = {type: 'wenzhen', data: retData}
  rServerConn.send(msg)
  callbacks['wenzhen'] = function (data) {
    res.send(data)
  }
})

app.listen(3000, () => {
	console.log('Listening')
})
