var express = require('express');

var app = express.createServer();

var users = [{ name: "alan" }];

app.configure(function(){
	app.use(express.staticProvider(__dirname + '/public'));
	app.use(express.bodyDecoder());
    app.use(express.logger({format: ':method:uri'});
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
});

app.all("/user/:id?", function(req, res, next){
	var index = req.params.id - 1;
	req.user = users[index];
	next();
});

app.get('/', function(req, res){
	res.send('hello world');
});

app.get("/user/:id?", function(req, res){
	var msg = req.user ? "hello again " + req.user.name : "hello new user " + req.params.id;
	res.send(msg);
});

app.post("/json_request", function(req, res){
	res.send(req.body);
});

app.listen(3000);
