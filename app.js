const express = require('express')
const multer = require('multer')
const app = express()
const fs = require('fs')
const csv = require('csv')
const iconv = require('iconv-lite')
const bodyParser = require('body-parser')
const session = require('express-session')
const cons = require('consolidate')

let diseases = []
let binghou = []
let medicine = []
let zhongyao = {}

let userInfos = {} // user credentials & other info

let distance = ['euclidean', 'maximum', 'manhattan', 'canberra', 'binary']
let juleiMethod = ['ward.D', 'ward.D2', 'single', 'complete', 'average', 'mcquitty', 'centroid']

if (fs.existsSync(`${__dirname}/data/userInfos.json`)) {
	fs.readFile(`${__dirname}/data/userInfos.json`, (err, contents) => {
		userInfos = JSON.parse(contents)
		console.log(userInfos)
	})
}

fs.readFile(`${__dirname}/data/medicine.csv`, (err, contents) => {
   var str = iconv.decode(contents, 'gb18030')
   csv.parse(str, (err, data) => {
     data.forEach(d => {
       medicine.push(d[0]);
     })
   })
})

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

fs.readFile(`${__dirname}/data/zhong1.csv`, (err, contents) => {
	let str = iconv.decode(contents, 'gb18030')
	csv.parse(str, (err, data) => {
		let names = data[0]
	  for (var i = 0; i < names.length; i++) {
	  	if (names[i] === '') {
	  		continue
	  	}
	  	zhongyao[names[i]] = {
	  		'药材来源': data[1][i],
	  		'性状': data[2][i],
	  		'鉴别': data[3][i],
	  		'性味归经': data[4][i],
	  		'功能主治': data[5][i],
	  		'用法用量': data[6][i],
	  		'注意事项': data[7][i],
	  		'贮藏': data[8][i],
	  		'标准收载': data[9][i]
	  	}
	  }
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

function checkAuth(req, res, next) {
	console.log(req.session, req.session.valid)
	if (req.url !== '/' && req.url !== '/login' && req.url !== '/register' && (!req.session || !req.session.valid)) {
		res.status(401).send('请重新登录')
		return
	}
	next()
}


app.engine('html', cons.mustache)
app.set('views', './views')
app.set('view engine', 'html')

app.use(express.static('./static'))
app.use(express.static('./views'))
app.use(bodyParser.urlencoded())
app.use(session({ secret: 'xiashudata', cookie: { maxAge: 600000 }, rolling: true, saveUninitialized: false }))
// app.use(checkAuth)

app.get('/', (req, res) => {
	res.redirect('/login')
})

app.get('/register', (req, res) => {
	res.render('register')
})

app.get('/main', (req, res) => {
	res.render('panel')
})

app.post('/upload', upload.single("yiy"), (req, res) => {
	res.end("Successfully Upload")
})

app.get('/login', (req, res) => {
	res.render('login')
})

app.post('/login', (req, res) => {
	console.log(userInfos)
	let username = req.body.username
	let password = req.body.password
	if (!(username in userInfos)) {
		res.status(401).send("用户名不存在")
	} else if (userInfos[username].password !== password) {
		res.status(401).send("密码不正确")
	} else {
		req.session.valid = true
		res.redirect('/main')
	}
})

app.post('/register', (req, res) => {
	let username = req.body.username
	let password = req.body.password
	if (username in userInfos) {
		res.status(409).send("用户已存在")
	} else {
		userInfos[username] = { password: password }
		fs.writeFile(`${__dirname}/data/userInfos.json`, JSON.stringify(userInfos), err => {
			console.log(err)
			console.log('file saved')
		})
		res.sendStatus(201)
	}
})

app.get('/wenzhen', (req, res) => {
	let reqData = []
	for (bh in req.query) {
		if (req.query[bh] !== '') {
			reqData.push(binghou.indexOf(req.query[bh]) + 1)
		}
	}
	let msg = {type: 'wenzhen', data: reqData}
	rServerConn.send(msg)
	callbacks['wenzhen'] = function (data) {
		let send = []
		//send = diseases[data]
		data.forEach(d => {
			send.push(diseases[d - 1])
		})
		res.send(send)
	}
})

app.get('/relation', (req, res) => {
	let msg = {type: 'relation', medsChosen: req.query.medsChosen, numClusters: req.query.numClusters, supp: req.query.supp, conf:req.query.conf, sort:req.query.sort, min:req.query.min, max:req.query.max}
	rServerConn.send(msg)
	callbacks['relation'] = function(data){
		let path = []
		path.push('/pictures/grouped_plot.jpeg')
		path.push('/pictures/graph_plot.jpeg')
		path.push('/pictures/scatter_plot.jpeg')
		path.push('/pictures/paracoord_plot.jpeg')
		path.push('/pictures/matrix_plot.jpeg')
		path.push('/pictures/item_freq.jpeg')
		
		let table = []

		fs.readFile(`${__dirname}/association_rules.csv`, (err, contents) => {
		  var str = iconv.decode(contents, 'gb18030')
		  csv.parse(str, (err, data) => {
			data.forEach(d => {
			  table.push(d)
			  //console.log(d)
			})
			console.log(table)
			let send = []
			send.push(path)
			send.push(table)
			res.send(send)
		  })
		})
		
	}
})

app.get('/jiansuo', (req, res) => {
	let name = req.query.name
	if (name in zhongyao) {
		res.send(zhongyao[name])
	} else {
		res.send('')
	}
})

app.get('/julei', (req, res) => {
	//console.log(req.query.distance, req.query.method, parseInt(req.query.cut))
	let reqData = []
	reqData.push(distance.indexOf(req.query.distance) + 1)
	reqData.push(juleiMethod.indexOf(req.query.method) + 1)
	reqData.push(parseInt(req.query.cut))
	let msg = {type: 'julei', data: reqData}
	rServerConn.send(msg)
	callbacks['julei'] = function(data){
		let path = []
		path.push('/pictures/tree_structure.jpeg')
		path.push('/pictures/julei.jpeg')
		res.send(path)
	}
})

app.get('/tuijian', (req, res) => {
	if(req.query['freq'] !== ''){
		console.log(req.query['freq'])
		let msg = {type: 'tuijian', data: req.query['freq']}
		rServerConn.send(msg)
	}
	callbacks['tuijian'] = function (data) {
		let send = []
		data.forEach(d => {
			let listOfSend = []
			for(var i = 0; i < d.length; i++){
				listOfSend.push(medicine[d[i]])
			}
			send.push(listOfSend)
		})
		console.log(send)
		res.send(send)
	}
})

app.get('/data/binghou', (req, res) => {
	res.send(binghou)
})

app.get('/data/zhongyao', (req, res) => {
	//res.send(medicine)        //for downloading csv file
	res.send(Object.keys(zhongyao))
})

app.get('/data/medicines', (req, res) => {
  res.send(medicine.slice(0, 40))
})

app.listen(3000, () => {
	console.log('Listening')
})
