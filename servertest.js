var net = require('net');
var client = new net.Socket();

client.connect(6011, '127.0.0.1', function() {
	console.log('Connected');
	var v = '哈罗 2'
	client.write(v + '\n' + '1 \n');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	//client.destroy();
});


