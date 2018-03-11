const express = require('express')
const multer = require('multer')
const app = express()

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
	let retData = []
	for (bh in req.query) {
		if (req.query[bh] !== '') {
			retData.push(req.query[bh])
		}
	}
	res.send(retData)
})

app.listen(3000, () => {
	console.log('Listening')
})
