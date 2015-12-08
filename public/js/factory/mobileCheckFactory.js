angular.module('testApp').provide.service('mobCheckFactory', function() {
	window.globalObjectStorer=JSON.parse(localStorage.getItem('globalObject')) || {};
	return mobileCheckresult ={
			 Blocker : {
					create:function(){
						var blockrString = '<div class="loader"><div class="loop1"></div><div class="loop2"></div>';
						$("html").append(blockrString);
					},
					destroy:function(){
						$(".loader").remove();
					}
			},
				colorCodes:[
				            "#3EE2C1",
				            "#F5B192",
				            "#F592A6",
				            "#C592F5",
				            "#77D391",
				            "#CFD377",
				            "#CCB07F",
				            "#DDADAD",
				            "#FF8E8E",
				            "#ADFA95",
				            "#C298B4",
				            ], 
				mobileCheck:function isMobile() {
				    var mobile = ['iphone','ipad','android','blackberry',
				                  'nokia','opera mini','windows mobile','windows phone','iemobile']; 
				    for (var i in mobile)
				    	if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) 
				    		return false;
				    return false;//default
				},
				sessionStorer:{
					setItem:function(key,val){
						globalObjectStorer[key] = val;
						localStorage.setItem('globalObject',JSON.stringify(globalObjectStorer));
					},
					getItem:function(key){
						return globalObjectStorer[key] || null;
					},
				}
		 };
	 });