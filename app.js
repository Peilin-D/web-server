const express = require('express')
const multer = require('multer')
const app = express()
const fs = require('fs')
const csv = require('csv')
const iconv = require('iconv-lite')

var net = require('net');
var client = new net.Socket();

let diseases = []
let binghou = []

fs.readFile(`${__dirname}/data/b_coded.csv`, (err, contents) => {
  var str = iconv.decode(contents, 'gb18030')
  csv.parse(str, (err, data) => {
    data.forEach(d => {
      diseases.push(d[0]);
    })
    diseases.splice(0, 1);
    filteredDiseases = diseases;
  })
})

fs.readFile(`${__dirname}/data/z_coded.csv`, (err, contents) => {
  var str = iconv.decode(contents, 'gb18030')
  csv.parse(str, (err, data) => {
    data.forEach(d => {
      binghou.push(d[0]);
    })
    binghou.splice(0, 1);
    filteredBinghou = binghou;
  })
})


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
	let reqData = []
	for (bh in req.query) {
		if (req.query[bh] !== '') {
			reqData.push(req.query[bh])
		}
	}
	let msg = {type: 'wenzhen', data: reqData}
	rServerConn.send(msg)
	callbacks['wenzhen'] = function (data) {
		send = diseases[data]
		let send = []
		data.forEach(d => {
			send.push(diseases[d - 1])
		})
		res.send(send)
	}
})

app.get('/data/binghou', (req, res) => {
	res.send(binghou)
})

app.listen(3000, () => {
	console.log('Listening')
})

module.exports = {
  diseases
}