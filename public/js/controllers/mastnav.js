angular.module('testApp').controllerProvider.register('masternavcntrlr', 
		function($scope,$rootScope,$location,$timeout){
	$rootScope.regListheight =  (window.innerHeight - 50)+"px";
	$scope.movNarml = window.innerWidth >1230 ? "movenorml" : "";
	$(window).resize(function(){
		$rootScope.$apply(function(){
			$rootScope.regListheight = (window.innerHeight - 50) + "px";
			$rootScope.usrMngmntListheight = (window.innerHeight - 50 ) + "px";
	    });
		if(window.innerWidth >1230){
			$(".leftnavclass").css({
				"-webkit-transform":" translateX(0px) translateZ(0px) ",
				"-moz-transform":" translateX(0px) translateZ(0px) ",
				"-o-transform":" translateX(0px) translateZ(0px) ",
				"transform":" translateX(0px) translateZ(0px) ",
			});
			$(".leftsidelist").addClass("movenorml");
			$(".blockr").hide();
			//$(".leftnavclass .nonfilgridsholder").addClass("inleft").removeClass("movenorml");
		}
	});
	$scope.opensettings=function(){
		if(window.innerWidth <=1230){
			$(".leftnavclass").css({
				"-webkit-transform":" translateX(0px) translateZ(0px) ",
				"-moz-transform":" translateX(0px) translateZ(0px) ",
				"-o-transform":" translateX(0px) translateZ(0px) ",
				"transform":" translateX(0px) translateZ(0px) ",
			});
			$(".blockr").show();
			$(".leftsidelist").addClass("movenorml");
		}
		};
		
	 if($.trim(localStorage.getItem("currentUser")) != "") 
	 {
		 var role = JSON.parse(localStorage.getItem('currentUser')).data.role.selectedResult
		 if(role=="Admin"){
			 $scope.navigationMenu = {
						header:{
				    		title:"STATUS MAGIK",
				    	},
				    	body:{
							menu:[
							      {title:"Users" ,href:".registration",icon:"icon icon-user-group"},
							      {title:"Projects" ,href:".ProjectsList",icon:"icon icon-folder"},
							      {title:"Magik book" ,href:".Kritik",icon:"icon icon-conversation"},
							      ]	
				    	}
				};
		 }
		 else{
			 $scope.navigationMenu = {
						header:{
				    		title:"TEST MAGIK",
				    	},
				    	body:{
							menu:[
							      {title:"Projects" ,href:".ProjectsList",icon:"icon icon-folder"},
							      {title:"Magik book" ,href:".Kritik",icon:"icon icon-conversation"},
							      {title:"Stats..soon" ,href:"",icon:"icon icon-graph-bar"},
							      ]	
				    	}
				};
		 }
	 }
	 else{
		 $rootScope.logoff();
	 }
		
	$scope.closesettings=function(){
		if(window.innerWidth <=1230){
			$(".leftsidelist").removeClass("movenorml");
				$(".leftnavclass").css({
					"-webkit-transform":" translateX(-100%) translateZ(0px) ",
					"-moz-transform":" translateX(-100%) translateZ(0px) ",
					"-o-transform":" translateX(-100%) translateZ(0px) ",
					"transform":" translateX(-100%) translateZ(0px) ",
				});
				$(".blockr").hide();
		}
		};
	$rootScope.logoff = function(){
		$location.path("/");
		localStorage.setItem("currentUser",null);
		localStorage.setItem("globalObject",null);
		iosocket.disconnect();
	};
});