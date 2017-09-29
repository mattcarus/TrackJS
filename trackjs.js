var trackHQ;
var debug = false;
var clientID;	// This is the ID for TrackJS
var appUserID;	// This is an app-supplied user ID, useful for cross-correlating TrackJS events with other logging 
var pageLoadTime = Date.now();
var jQuerySrcLocation = 'http://code.jquery.com/jquery-1.11.0.min.js';

var track = {
	init: function(configTrackHQ, configAppUserID, configDebug) {
		trackHQ=configTrackHQ;
		appUserID=configAppUserID||null;
		debug=configDebug||false;
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
		if ( this.getCookie("TrackJS") )
		{
			return this.getCookie("TrackJS");
		}
		else
		{
			var newClientId = this.generateGUID();
			this.setCookie("TrackJS", newClientId, 365);
			return newClientId;
		}
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
				
				$(document).ready( function() { track.sendEvent({"event": "load"}) } );
				$(window).on('beforeunload', function() {
					track.sendEvent({"event": "unload"});
				});
				$(document).on("click", function(event) {
					track.sendEvent({"event": "click", "click": {"x": event.pageX, "y": event.pageY}, "scrolled": {"x": $(document).scrollLeft(), "y": $(document).scrollTop()}});
				} );
				
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
				$("a").each(function() {
					$(this).click(function() { 
						track.sendEvent({event: 'click', data: this.toString(), tag: this.tagName, name: this.name, id: this.id})
					})
				});
				$("body").find("*").each(function() {
					$(this).click(function() {
						track.sendEvent({event: 'click', data: this.toString(), tag: this.tagName, name: this.name, id: this.id});
					});
				});
			*/
		}
	},
	sendEvent: function(event) {
		event._time = Date.now();
		event._elapsed = event._time - pageLoadTime;
		event._url = document.URL;
		event._title = document.title;
		event._clientid = clientID;
		event._appUserID = appUserID;
		
	/*
	 * AJAX-style callback to server (note CORS)
	 */
	/*
		$.ajax({
			type: "POST",
			crossDomain: true,
			url: trackHQ,
			data: event
		}).done(this.logger(event));
	*/
	/*
	 * Pixel-style callback
	 */
		var pixel = document.createElement('img');
		pixel.src = trackHQ + "?event=" + btoa(JSON.stringify(event));
		document.getElementsByTagName('body')[0].appendChild(pixel);
		this.logger(event);
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
	},
	getCookie: function(cookieName) {
	    var name = cookieName + "=";
	    var decodedCookie = decodeURIComponent(document.cookie);
	    var ca = decodedCookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return false;
	},
	setCookie: function(cookieName, cookieValue, cookieValidityDays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (cookieValidityDays * 24 * 60 * 60 * 1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
	}
};