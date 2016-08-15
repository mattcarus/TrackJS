// track.js

//Enter the location (as seen by a web client) of your TrackHQ.php file here
var trackHQ = "http://mydomain.com/trackhq.php";

// Set debug to true to log events to the browser's javascript console, false hides events
var debug = false;

var clientID;
var pageLoadTime = Date.now();
var jQuerySrcLocation = 'http://code.jquery.com/jquery-1.11.0.min.js';

var track = {
	init: function() {
		clientID = this.getClientID();
		this.logger('Set ClientID');
		this.logger('TrackJS Loading...');
		if (typeof jQuery == 'undefined') {
			this.logger('Loading jQuery');
			var jQueryScript = document.createElement('script');
			jQueryScript.type = 'text/javascript';
			jQueryScript.src = jQuerySrcLocation;
			document.getElementsByTagName('head')[0].appendChild(jQueryScript);
			setTimeout(function() { track.attachEvents(); }, 100);
		}
	},
	getClientID: function() {
		var cookie = document.cookie.split(';');
		for(var i=0; i<cookie.length; i++) 
		{
		  var c = cookie[i].trim();
		  if (c.indexOf("TrackJS=")==0) {
			  return c.substring("TrackJS=".length,c.length);
		  }
		}
		var newClientId = this.generateGUID();
		var d = new Date();
		d.setTime(d.getTime()+(365*24*60*60*1000));
		document.cookie = "TrackJS=" + newClientId + "; expires=" + d.toGMTString();
		return newClientId;
	},
	attachEvents: function() {
		if (typeof jQuery == 'undefined') {
			this.logger('jQuery not loaded, waiting...');
			setTimeout(function() { track.attachEvents() }, 500);
		}
		else
		{
				this.logger('jQuery loaded');
				this.logger('Attaching events');
				
				$(document).ready( function() { track.sendEvent({event: 'load', data: this.toString(), tag: this.tagName, name: this.name, id: this.id}) } );
				$(window).on('beforeunload', function() {
					track.sendEvent({event: 'unload', data: this.toString(), tag: this.tagName, name: this.name, id: this.id});
				});
//				$(document).unload( function() { track.sendEvent({event: 'unload', data: this.toString(), tag: this.tagName, name: this.name, id: this.id}) } );
				$("a").each(function() {
					$(this).click(function() { 
						track.sendEvent({event: 'click', data: this.toString(), tag: this.tagName, name: this.name, id: this.id})
					})
				});
				
				/*
				 * Add additional events here, for example you could monitor mouseovers using this:
				 *
				 
				$("body").find("*").each(function() {
					$(this).mouseover(function() { 
						track.sendEvent({event: 'mouseOver', data: this.toString(), tag: this.tagName, name: this.name, id: this.id})
					})
				});
				$("body").find("*").each(function() {
					$(this).mouseout(function() {
						track.sendEvent({event: 'mouseOut', data: this.toString(), tag: this.tagName, name: this.name, id: this.id})
					})
				});
				*/
				$("body").find("*").each(function() {
					$(this).click(function() {
						track.sendEvent({event: 'click', data: this.toString(), tag: this.tagName, name: this.name, id: this.id});
					});
				});
				$(document).on("click", function(event) {
					track.sendEvent({event: 'click', click: {x: event.pageX, y: event.pageY}, scrolled: {x: $(document).scrollLeft(), y: $(document).scrollTop()}});
				} );
		}
	},
	sendEvent: function(event) {
		event._time = Date.now();
		event._elapsed = event._time - pageLoadTime;
		event._url = document.URL;
		event._title = document.title;
		event._clientid = clientID;
		
		$.ajax({
			type: "POST",
			crossDomain: true,
			url: trackHQ,
			data: event
		}).done(this.logger(event));
	},
	logger: function(logMsg) {
		if ( debug ) {
			console.log('track.js: ' + clientID + " : " + JSON.stringify(logMsg));
		}
	},
	generateGUID: function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}
};
track.init();