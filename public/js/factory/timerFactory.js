angular.module('testApp').provide.service('timerFactory', function($rootScope) {
	   var myWorker;
	return timer ={
			  eventdelgt: function () {
				     if (typeof Worker !== "undefined") {
						    if (typeof myWorker == "undefined") {
						         myWorker = new Worker("js/worker.js");
						    }
						} else {
						    alert("it was designed to work in IE 10 + browsers or chrome/ff/safari/opera,,,so please upgrade urself")
						}
		            myWorker.addEventListener("message", function (e) {
		                if (e.data.split("_")[0] == "tim") {
		                	 $rootScope.$apply(function()
			       	    	          {
		                		 $rootScope.times = e.data.split("_")[1];
			       	    	          });
		                } 
		            }, false);
		        },
					        start: function ( ) {
					        	if(myWorker)
					            myWorker.postMessage("start");
					        },
					        stop: function ( ) {
					        	if(myWorker)
					            myWorker.postMessage("stop");
					        },
					        hold:function(){
					        	if(myWorker)
					            myWorker.postMessage("hold");
					        },
					        cont:function ( ) {
					        	if(myWorker)
					            myWorker.postMessage("cont");
					        },
			  
	}
	 });