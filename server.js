var express = require('express'),
	port 	= process.env.PORT || 5000,
	app   	= express(), 
	io 		= require('socket.io').listen(app.listen(port));

//CONFIGURE EXPRESS	
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use( express.static( __dirname + '/public' ));
});

app.get("/", function(req, res){
	res.render('index',{title:"Nodejs / EJS / Socket.io / Express Tut"});
});

var gridEvents = {
		UPDATE_SPOT	:'update_spot',
		STATUS		:'grid_status'	
	},
	grid = [0,0,0,
			0,0,0,
			0,0,0];


io.sockets.on('connection', function (socket) {
	socket.emit(gridEvents.STATUS, {"grid":grid});
	socket.on(gridEvents.UPDATE_SPOT, function (data) {
         grid[data.spot] = data.isActive;
         socket.broadcast.emit(gridEvents.STATUS, {"grid":grid});
    });	  
});
