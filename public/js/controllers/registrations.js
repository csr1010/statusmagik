angular.module('testApp').controllerProvider.register('registrationController',
		function($scope, serviceFactory, mobCheckFactory,formvalidationFactory,$rootScope) {
			$scope.alert = {
				type : '',
				msg : ''
			};
			$scope.opensettings=function(){
				
				if(window.innerWidth <=1230){
					$(".leftnavclass").css({
						"-webkit-transform":" translateX(0px) translateY(0px) translateZ(0px) ",
						"-moz-transform":" translateX(0px) translateY(0px) translateZ(0px) ",
						"-o-transform":" translateX(0px) translateY(0px) translateZ(0px) ",
						"transform":" translateX(0px) translateY(0px) translateZ(0px) ",
					});
					$(".blockr").show();
					$(".leftsidelist").addClass("movenorml");
					
				} 
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
			$rootScope.usrMngmntListheight = (window.innerHeight - 50 ) + "px";
				 
			$scope.totEmpList = [];
			$scope.myformName = {
				namefiltr : [],
				WONfiltr : [],
				filteredresults : [],
				showHidesearch:false
			};
			$scope.regHead = {
				title : "Users",
			};
			$scope.regBody = {
					regBoxmodel : [  ]
				};
			/*$scope.$watch('regBody.regBoxmodel',function(n,o){
				console.log(n)
				console.log(o)
			},true);*/
			$scope.roleChange = function(obj){
				if(obj.info.isExisting && obj.role.selectedResult=="NoRole"){
					obj.info.isChangedtoNoRole = true;
				}
				else{
					obj.info.isChangedtoNoRole = false;
				}
			};
			$scope.inactivateEmployee = function(obj){
				obj.role.selectedResult="NoRole";
				if(obj.info.isExisting){
					obj.info.isChangedtoNoRole = true;
				}
				
			};
			$scope.activateEmployee = function(obj){
				obj.info.isChangedtoNoRole = false;
			};
			$scope.addRegbox =function(){
				var emptyregBox={
					info : {
						disabled : false,
						classy : false,
						isChanged:true,
						tobeDeleted:false,
						isExisting:false,
						isChangedtoNoRole:false
					},
					chckybox : {
						selectedResult : false,
					},
					empid : {
						type : mobCheckFactory.mobileCheck() ? "number"
								: "number",
						selectedResult : "",
						placeHolder : "EMP ID",
					},
					name : {
						selectedResult : "",
						placeHolder : "EMP NAME",
					},
					transferTO:{
						selectedResult : "",
						transferDone:false
					},
					contact:{
							type : mobCheckFactory.mobileCheck() ? "number"
								: "number",
						selectedResult : "",
						placeHolder : "CONTACT NO:",
					},
					Account : {
						selectedResult :$scope.provideuserSessionData("Account"),
						placeHolder : "Account",
						disabled : true
					},
					role : {
						 
						list : [ "Admin", "SubOrdinate", "NoRole" ],
						selectedResult : "NoRole",
					},
					status : {
						list : [ {txt: "Active",cls:"success"}, {txt: "InActive",cls:"default"}],
						selectedResult : "Active",
					}
				};
					if(
						($scope.regBody['regBoxmodel'].length > 0 ? $scope.saveREGbox() : true)
					  )
					{
						var arrayofREGboxes = $scope.regBody['regBoxmodel'];
						for(var i=0;i<arrayofREGboxes.length;i++){
							if(arrayofREGboxes[i].chckybox.selectedResult)
								arrayofREGboxes[i].chckybox.selectedResult=false;
						}
						$scope.regBody['regBoxmodel'].unshift(emptyregBox);
					}
				
			
			} ;
			$scope.saveREGbox = function(){
				var errorResponse = formvalidationFactory.formValidation($scope.myformName.form);
				if(!errorResponse.error 
						&& ($scope.myformName['namefiltr'].length==0)
						&& ($scope.myformName['WONfiltr'].length==0)
				  ){ 
					$scope.regBody['regBoxmodel'].forEach(function(obj,index){
					if($scope.totEmpList.indexOf(obj.empid.selectedResult)<0) 
						$scope.totEmpList.push(obj.empid.selectedResult);
					});
					return true;
				}
				else{
					$scope.alert.type = "danger";
        	    	$scope.alert.msg = errorResponse.description || "Please remove filters before adding ";
					return false;
				}
			};
			$scope.copyREGboxes =function(){
				var arrayofREGboxes = $scope.regBody['regBoxmodel'];
				arrayofREGboxes=arrayofREGboxes.filter(function(val){
					return val.chckybox.selectedResult;
				});
				
				for(var i=0;i<arrayofREGboxes.length;i++){
					arrayofREGboxes[i].chckybox.selectedResult=false;
					delete arrayofREGboxes[i].$$hashKey;
					var emptyREGBox = angular.copy(arrayofREGboxes[i]);
					if($scope.saveREGbox())
						{
							 $scope.regBody['regBoxmodel'].unshift(emptyREGBox);
						}
					else{
						break;
					}
				}
			};
			$scope.deleteUsers = [];
			$scope.deleteREGboxes =function(){
				$scope.regBody['regBoxmodel'] = 
					$scope.regBody['regBoxmodel'].filter(function(val){
							if(val.chckybox.selectedResult){
								if(val.info.isExisting && val.role.selectedResult=="NoRole"){
									$scope.alert.type = "danger";
				        	    	$scope.alert.msg = "please transfer the role to some other employee";
									return true;
								}
								else{
									val.info.tobeDeleted = true;
									if($scope.deleteUsers.indexOf(val.empid.selectedResult) < 0 ){
										$scope.deleteUsers.push(val.empid.selectedResult);
									}
									return true;
								}
							}
							else{
								return true;
							}
				});
				
				$scope.submitREGboxes();
			};
			 $scope.ifregSuccess = function(data){
	        	    if(data.status){
	        	    	$scope.alert.type = "success";
	        	    	$scope.alert.msg = data.message;
	        	    	$scope.deleteUsers=[];
	        	    	 
	        	    }else{
	        	    	$scope.alert.type = "danger";
	        	    	$scope.alert.msg = data.message;
	        	    }
	            };
				 $scope.iffail = function(errorstat){
					 	$scope.alert.type = "danger";
				    	$scope.alert.msg = errorstat;
				 };
		     $scope.iffetchSuccess = function(data){
	        	    if(data.status){
	        	    	$scope.alert.type = "success";
	        	    	$scope.alert.msg = data.message;
	        	    	$scope.regBody['regBoxmodel']=[];
	        	    	$scope.regBody['regBoxmodel'] = 
	        	    	$scope.regBody['regBoxmodel'].concat(data.data);
	        	    	$scope.regBody['regBoxmodel'].forEach(function(obj,index){
	    					if($scope.totEmpList.indexOf(obj.empid.selectedResult)<0) 
	    						$scope.totEmpList.push(obj.empid.selectedResult);
	    					});
	    				mobCheckFactory.sessionStorer.setItem('allUsers',JSON.stringify($scope.regBody['regBoxmodel']));
	        	    }else{
	        	    	$scope.alert.type = "danger";
	        	    	$scope.alert.msg = data.message;
	        	    }
	            
		     };
			$scope.submitREGboxes = function(){
				if(
						($scope.regBody['regBoxmodel'].length > 0 ? $scope.saveREGbox() : true)
					  )
					{
				var postData  = 
					$scope.regBody['regBoxmodel'].filter(function(val){
							return (val.info.isChanged);
				});
				var temp = {
						postData :postData,
						deleters:$scope.deleteUsers,
						account:$scope.provideuserSessionData("Account")
				}
				if(postData.length > 0 || $scope.deleteUsers.length > 0)
					 serviceFactory.getData({
				            url: '/register',
				            method: "POST",
				            data: temp,
				        },$scope.ifregSuccess,$scope.iffail);
				}
			};
			$scope.fetchREGBox=function(x){
				 serviceFactory.getData({
			            url: '/users/'+x,
			            method: "GET",
			            cache:true,
			        },$scope.iffetchSuccess ,$scope.iffail);
			};
			 (function(){
					 var Account = $scope.provideuserSessionData("Account");
					 $scope.regBody['regBoxmodel'] =[];
					 $scope.regBody['regBoxmodel'] = JSON.parse(mobCheckFactory.sessionStorer.getItem('allUsers')) || [];
					 if($scope.regBody['regBoxmodel'].length==0)
						 $scope.fetchREGBox(Account);
			 })();
		});