var express  = require('express');  
var http  = require('http'); 
var app      = express();
GLOBAL.mongojs = require('mongojs');
//GLOBAL.db = mongojs('mongodb://csr:root@ds063307.mongolab.com:63307/xammagik',['userstests','examslisttests','questionstests','answertests' ]);
GLOBAL.db = mongojs('mongodb://chetan10:chetan10@ds061474.mongolab.com:61474/statusmagik',['users','projects','accounts','runlist','JIRA','testcases','posts']);
app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
}); 
Date.prototype.getFullDate = function( date ){
	var mnth = ( date.getMonth()+1 ) < 10 ? "0"+(date.getMonth()+1) :( date.getMonth()+1 );
	var dates = ( date.getDate() ) < 10 ? "0"+(date.getDate()) :( date.getDate() );
    return [date.getFullYear(),mnth, dates ].join('/');
}; 
var server = http.createServer(app).listen(process.env.PORT ||  3000);
console.log("App listening on port"+server.address().port);
 var projectcreations = require('./api/projectdetails');
 GLOBAL.sockets  = [];
GLOBAL.sktio = require('socket.io').listen(server);
sktio.sockets.on('connection', function (socket) {
GLOBAL.skt= socket;
sockets.push(skt);
console.log('connctd Received'+sockets);
skt.on('message', function (msg) {
//console.log('Message Received: ', msg);
 projectcreations.postcritic(msg);
});
skt.on('delmessage', function (msg) {
//console.log('delmessage Received: ', msg);
 projectcreations.delPosts(msg);
});
});

app.get('/chetanprofile', function(req, res) {
	res.sendfile('./public/chetan.html'); // load the single view file (angular will handle the page changes on the front-end)
});
app.get('/memories', function(req, res) {
	res.sendfile('./public/latif.html'); // load the single view file (angular will handle the page changes on the front-end)
});
app.get('/ganesh', function(req, res) {
	res.sendfile('./public/ganesh.html'); // load the single view file (angular will handle the page changes on the front-end)
});
/*app.get('/#', function(req, res) {
	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});*/

app.get('/adminreg', function(req, res) {
	res.sendfile('./public/adminreg.html'); 
});
/*app.use(express.basicAuth(function(user, pass) {
	return user === 'root' && pass === 'root';
}));*/

//Bootstrap routes
require('./routes/restRouter')(app);

