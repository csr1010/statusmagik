angular.module('testApp').controllerProvider.register('kritikController', function(
		$scope, serviceFactory, mobCheckFactory,$location,$window,$rootScope,formvalidationFactory,$timeout)
{
	$scope.alert = {
			type : '',
			msg : '',
			form:null,
			range:5,
		};
	$scope.editbutton=true;
	$scope.sendbutton=false;
	$rootScope.regListheight = (window.innerHeight - 50) + "px";
	$scope.provideuserSessionData = function(i){
		var wantd =  JSON.parse(localStorage.getItem('currentUser')) ?
				JSON.parse(localStorage.getItem('currentUser')).data[i].selectedResult : false
				if(!wantd){
					 $rootScope.$apply(function()
	       	    	          {
						 			$rootScope.logoff();
	       	    	          });
				}
				else{
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
	$scope.currentUser = $scope.provideuserSessionData("empid");
	$scope.newCritic = {
			post:{
				selectedResult:"",
				placeHolder:"share your experience..",
				disabled:false,
			},
		info:{
			clas:"kritinew",
			tstmp:new Date().getTime()
		},
		account:$scope.provideuserSessionData("Account"),
		empid:$scope.provideuserSessionData("empid"),
		name:$scope.provideuserSessionData("name"),
		color:"gray",
		postid:new Date().getTime()
		+ "PST"
		+ $scope.provideuserSessionData("empid")
	};
	$scope.deleteCritic = function(k){
		iosocket.emit("delmessage",$scope.allCritics.list[k].postid);
		/*	serviceFactory.getData({
				url : '/delPosts/' + $scope.allCritics.list[k].postid,
				method : "GET",
				cache : true,
			}, function(data){
				$scope.ifdelSuccess(data,k);
			}, $scope.iffail);*/
	};
	$scope.editCritic = function(i){
		i.post.disabled=false;
		$scope.editbutton=false;
		$scope.sendbutton=true;
	};
	window.iosocket = io.connect();
		iosocket.on('connect', function () {
			console.log("connected");
			iosocket.on('message', function(message) {
				$scope.iffetchSuccess(message);
			});
			iosocket.on('delmessage', function(message) {
				$scope.ifdelSuccess(message);
			});
			iosocket.on('disconnect', function() {
				console.log("bye bye socket");
			});
		});
	$scope.postcritic = function(i){
		var data = "";var errorFlg=false;
		if(i==0 || i==-1){
			var newObj = angular.copy($scope.newCritic);
			newObj.color = mobCheckFactory.colorCodes[Math.round(Math.random(1) * 10)];
			newObj.name = $scope.provideuserSessionData("name");
			newObj.account=$scope.provideuserSessionData("Account"),
			newObj.empid = $scope.provideuserSessionData("empid");
			newObj.postid= new Date().getTime()
							+ "PST"
							+ newObj.empid;
			newObj.info.tstmp= new Date().getTime();
			
			
			if(i==-1){
				errorFlg = false;
				$scope.allCritics.list.unshift(newObj);
			}
			else{
				data = angular.copy($scope.allCritics.list[0]);
				data.post.disabled=true;
				$scope.allCritics.list[0].post.disabled=true;
				errorFlg = data.post.selectedResult !="" ? true : false;
				if(errorFlg){
					$scope.allCritics.list.unshift(newObj);
					$timeout(function(){
							$scope.allCritics.list[1].info.clas="kritinormal";
	    				},450);
				}
				
			}
			
		}else{
			data = i;
			errorFlg = data.post.selectedResult !="" ? true : false;
			if(errorFlg)
			data.post.disabled=true;
			$scope.editbutton=true;
			$scope.sendbutton=false;
		}
		if(errorFlg){
			data.info.clas="kritinormal";
			iosocket.emit("message",data);
		}
		/*serviceFactory.getData({
            url: '/postcritic',
            method: "POST",
            cache:false,
            data:data
        },$scope.iffetchSuccess ,$scope.iffail);*/
		
	};
	  $scope.iffetchSuccess = function(data){
  	    if(data.status){
  	    	var flag = true;
  	    		$scope.$apply(function()
     	    	          {
		  	    			for(var lp = 0 ; lp < $scope.allCritics.list.length ; lp++){
		  	    				if($scope.allCritics.list[lp].postid == data.data.postid){
		  	    					flag= false;
		  	    					break;	
		  	    				}
		  	    			}
		  	    			if(flag){
		  	    				data.data.info.clas="kritinew";
		  	    				$scope.allCritics.list.splice(1,0,data.data);
		  	    				$timeout(function(){
		  	    					data.data.info.clas="kritinormal";
		  	    				},450);
		  	    			}
		  	    				
     	    	          });
  	    		mobCheckFactory.sessionStorer.setItem('currentPosts',JSON.stringify($scope.allCritics.list));
  	    }else{
  	    	$scope.alert.type = "danger";
  	    	$scope.alert.msg = data.message;
  	    }
      
	  };
	  $scope.ifdelSuccess = function(data){
	  	    if(data.status){
	  	    	$scope.allCritics.list = $scope.allCritics.list.filter(function(val){
					return (val.postid != data.data);
				});
	  	    	mobCheckFactory.sessionStorer.setItem('currentPosts',JSON.stringify($scope.allCritics.list));
	  	    }else{
	  	    	$scope.alert.type = "danger";
	  	    	$scope.alert.msg = data.message;
	  	    }
	      
		  };
	  $scope.iffail = function(errorstat){
					 	$scope.alert.type = "danger";
				    	$scope.alert.msg = errorstat;
	 };
	$scope.allCritics={
			list:[{
				post:{
					selectedResult:"",
					placeHolder:"Share your Experience..",
					disabled:false,
				},
				info:{
					clas:"kritinew"
				}			,
				empid:$scope.provideuserSessionData("empid"),
				name:$scope.provideuserSessionData("name"),
				color:mobCheckFactory.colorCodes[Math.round(Math.random(1)*10)],
			}]
	};
	$scope.ifSuccess = function(data){
	    if(data.status){
	    	 $scope.allCritics.list =[];
	    	 $scope.allCritics.list  = data.data;
	    	mobCheckFactory.sessionStorer.setItem('currentPosts',JSON.stringify(data.data));
	    	$scope.postcritic(-1);
	    }else{
	    	$scope.alert.type = "danger";
	    	$scope.alert.msg = data.message;
	    }
    };
	(function(){
		 var currentPosts = JSON.parse(mobCheckFactory.sessionStorer.getItem('currentPosts')) || [];
		 if(currentPosts.length > 0 ){
			 $scope.allCritics.list = currentPosts;
			 $scope.postcritic(-1);
		 }
		 else{
			 serviceFactory.getData({
		            url: '/fetchPosts',
		            method: "GET",
		        },$scope.ifSuccess,$scope.iffail);
		 }
		
	})();
});