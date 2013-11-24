var script = function (win, doc) {
  "use strict";
  var _connectionState,
      _grid,
      _isConnected,
      _socket,
      socketEvents = {
        CONNECT       : 'connect',
        DISCONNECT    : 'disconnect',
        CONNECT_FAIL  : 'connect_failed',
        RECON_FAIL    : 'reconnect_failed',
        ERROR         : 'error'
      },
      gridEvents = {
        UPDATE_SPOT :'update_spot',
        STATUS    :'grid_status'  
      };
 
  function publicInit(){
      _grid =doc.getElementById('grid');
      _connectionState = doc.getElementById('connection-state');
      _socket = io.connect('http://localhost');
      _socket.addListener(socketEvents.CONNECT,     socketConnectedEvent);
      _socket.addListener(socketEvents.DISCONNECT,  socketDisconnectedEvent);
      _socket.addListener(socketEvents.ERROR,       socketErrorEvent);
      _socket.addListener(socketEvents.RECON_FAIL,  socketErrorEvent);

      _socket.addListener(gridEvents.STATUS, updateGridEvent);
      _grid.addEventListener('click', gridClickEvent, false);
  }
  function updateGridEvent(grid){
    var g = grid.grid;
    for(var i =0;i<g.length; i++){
        _grid.children[i].className = g[i]?'active':'';
    }
  }
  function gridClickEvent(e){
    if(_isConnected){
      var targ  = e.target;
      if(targ.tagName = "LI"){
        var isActive = targ.classList.contains('active');
        targ.className = isActive?'':'active';
        var childIdx = targ.dataset.idx;
        _socket.emit(gridEvents.UPDATE_SPOT, {"spot": childIdx, "isActive":isActive?0:1});
        console.log('spot: ', childIdx, " isActive: ", isActive?"no":"yes");
      }
    }
  }
  function setConnState(state){
    _connectionState.className = state;
  }
  function socketConnectedEvent(){
    _isConnected = true;
    setConnState(socketEvents.CONNECT);
  }

  function socketDisconnectedEvent(){
    _isConnected = false;
    setConnState(socketEvents.DISCONNECT);
  }

  function socketErrorEvent(){
    _isConnected = false;
    setConnState(socketEvents.ERROR);
  }

	return {
		init: publicInit
	};
}(window, document);
document.addEventListener("DOMContentLoaded", script.init, false);