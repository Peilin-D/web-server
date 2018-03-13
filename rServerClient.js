const net = require('net');

let callbacks = {}

function sendToCallBacks(msg) {
  if (msg.type[0] in callbacks) {
    callbacks[msg.type[0]](msg.data)
  }
}

class rServerConnection {
  constructor() {
    this.client = new net.Socket();
    this.client.on('data', function(data) {
      let msg = JSON.parse(data)
      sendToCallBacks(msg)
    });
    this.connect()
  }

  send(msg) {
    if (this.client && !this.client.connecting) {
      this.client.write(JSON.stringify(msg)+'\n');
    }
  }

  close() {
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }
  }

  connect() {
    this.client.connect(6011, '127.0.0.1', function() {
      console.log('Connected');
    });
  }
}

module.exports = {
  rServerConnection, 
  callbacks
}