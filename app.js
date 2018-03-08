const express = require('express')
const app = express()

app.use(express.static('./static'))
app.use(express.static('./views'))

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
