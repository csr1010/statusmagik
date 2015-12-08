angular.module('testApp').controllerProvider.register('ProjctsListController',
		function($scope, serviceFactory, mobCheckFactory,$location,$window,$rootScope) {
			$scope.alert = {
				type : '',
				msg : ''
			};
			$rootScope.regListheight = (window.innerHeight - 50) + "px";
			$scope.regHead = {
				firstLetter : "",
				title : "Projects List",
				button:{
					plus:false
				}
			};
			$scope.gotoTestCases = function(){
				$location.path("/home/testcases/new");
			};
			$scope.taketoTestcas = function(id){
				$location.path("/home/testcases/"+id);
			};
			$scope.provideuserSessionData = function(i){
				var wantd =  JSON.parse(localStorage.getItem('currentUser')) ?
						JSON.parse(localStorage.getItem('currentUser')).data[i].selectedResult : false
						if(!wantd){
							 $rootScope.$apply(function()
			       	    	          {
								 			$rootScope.logoff();
			       	    	          });
						}else{
							return wantd;
						}
			};
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
			$scope.regBody = {
				ProBoxmodel : []
			};
			 $scope.ifSuccess = function(data){

	        	    if(data.status){
	        	    	$scope.regBody.ProBoxmodel =[];
	        	    	$scope.regBody.ProBoxmodel  = data.data;
	        	    	mobCheckFactory.sessionStorer.setItem('currentProjects',JSON.stringify(data.data));
	        	    }else{
	        	    	$scope.alert.type = "danger";
	        	    	$scope.alert.msg = data.message;
	        	    }
	            };
				 $scope.iffail = function(errorstat){
					 	$scope.alert.type = "danger";
				    	$scope.alert.msg = "oops ! something is wrong tryAgain";
				 };
			(function(){
				var role = $scope.provideuserSessionData("role");
				 if(role=="Admin"){
					 $scope.regHead.button={
									plus:true
								};
				 }
				 else{
					 $scope.regHead.button={
								plus:false
							};
				 }
				 
				 var currentProjects = JSON.parse(mobCheckFactory.sessionStorer.getItem('currentProjects')) || [];
				 if(currentProjects.length > 0 ){
					 $scope.regBody.ProBoxmodel = currentProjects;
				 }
				 else{
					 serviceFactory.getData({
				            url: '/fetchProjects',
				            method: "POST",
				            data:{
				            	Account:$scope.provideuserSessionData("Account")
				            }
				        },$scope.ifSuccess,$scope.iffail);
				 }
				 
				 
			})();
		});
