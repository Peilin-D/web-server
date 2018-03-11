const express = require('express')
const app = express()
var net = require('net');
var client = new net.Socket();

app.use(express.static('./static'))
app.use(express.static('./views'))

client.connect(6011, '127.0.0.1', function() {
	console.log('Connected');
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html')
})

app.get('/register', (req, res) => {
	res.sendFile(__dirname + '/views/register.html')
})

app.get('/main', (req, res) => {
	res.sendFile(__dirname + '/views/main.html')
})

app.listen(3000, () => {
	console.log('Listening')
})
