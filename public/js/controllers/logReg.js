angular.module('testApp').controllerProvider.register('logregController', function(
		$scope,mobCheckFactory,formvalidationFactory,$location,serviceFactory)
{
	 $scope.alert =  { 
	                	type: '',
	                	msg: '' 
	                  };
	 
	 $scope.logindetails={
		form:"",
		empid:{
			placeHolder:"EMP ID",
    		selectedResult:"",
    		type:mobCheckFactory.mobileCheck() ? "number" :"number"
		},
		pwd:{
			placeHolder:"password",
    		selectedResult:"",
		}
	 };
	 $scope.logSuccess = function(result){

 	    if(result.status){
 	    	localStorage.setItem("currentUser",JSON.stringify(result));
 	    	$location[result.data.path.method](result.data.path.url);
 	    	
 	    }else{
 	    	$scope.alert.type = "danger";
 	    	$scope.alert.msg = result.message;
 	    }
     
	 };
	 $scope.logfail = function(errorstat){
		 	$scope.alert.type = "danger";
	    	$scope.alert.msg = "oops ! something is wrong tryAgain";
	 };
	 $scope.login = function(){
		 	var errorResponse = formvalidationFactory.formValidation($scope.logindetails.form);
			if(!errorResponse.error ){
		   		delete $scope.logindetails.form;
				var postData = formvalidationFactory.formSerialization($scope.logindetails) ;
				serviceFactory.getData({
		            url: '/signIn',
		            method: "POST",
		            data: postData,
		        }, $scope.logSuccess, $scope.logfail);
			 }
		   else{
				$scope.alert.type = "danger";
		    	$scope.alert.msg = errorResponse.description;
			}
		 };
		 $scope.regDetails={
					info : {
						disabled : false,
						classy : false,
						isChanged:false,
						tobeDeleted:false,
						isExisting:true,
						isChangedtoNeutral:false
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
						list:[
						       "test1"  ,
						       "test2"  ,
						       "test3"  ,
						       "test4"  ,
						     ],
						selectedResult : "",
						placeHolder : "Account",
						disabled : true
					},
					role : {
						list : [ "Admin", "SubOrdinate", "NoRole" ],
						selectedResult : "Admin",
					},
					status : {
						list : [ {txt: "Active",cls:"success"}, {txt: "InActive",cls:"default"}],
						selectedResult : "Active",
					},
					pwd:{
						placeHolder:"password",
			    		selectedResult:"",
					},
					form:"",
				};
	 $scope.regSuccess=function(data){
 	    if(data.status){
 	    	$scope.alert.type = "success";
 	    	$scope.alert.msg = data.message;
 	    }else{
 	    	$scope.alert.type = "danger";
 	    	$scope.alert.msg = data.message;
 	    }
     
	 };
	 $scope.regfail = function(errorstat){
		 	$scope.alert.type = "danger";
	    	$scope.alert.msg = "oops ! something is wrong tryAgain";
	 };
	 $scope.registration = function(){
		 var errorResponse = formvalidationFactory.formValidation($scope.regDetails.form);
			if(!errorResponse.error ){
			//var postData = formvalidationFactory.formSerialization($scope.regDetails) ;
			delete $scope.regDetails.form;
			serviceFactory.getData({
	            url: '/registerAdmin',
	            method: "POST",
	            data: $scope.regDetails,
	        }, $scope.regSuccess, $scope.regfail);
		 }
	   else{
			$scope.alert.type = "danger";
	    	$scope.alert.msg = errorResponse.description;
		}
	 };
	(function(){ 
		var currentUser  = JSON.parse(localStorage.getItem("currentUser"));
		 if(currentUser && currentUser.status){
 	    	$location[currentUser.data.path.method](currentUser.data.path.url);
 	    }
	})();
});