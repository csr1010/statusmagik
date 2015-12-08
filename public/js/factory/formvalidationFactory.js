angular.module('testApp').provide.service('formvalidationFactory', function($rootScope) {
	return formFactoryresult ={
			 	userarray:[],
				formValidation:function isformValid(form) {
					var errorDetails={
							error:false,
							description:""
					};
					if( form && form.$invalid) {
						var errorObject = form.$error;
						var errorFields = [];
						for(var obj in errorObject){
							if(angular.isArray(errorObject[obj])){
								errorObject[obj].forEach(function(val,indx){
									errorFields.push(val.$name);
								});
								switch(obj){
									case "required":
										errorDetails.error = true;
										errorDetails.description="'"+errorFields.join( " , ") +"' is Required";
										break;
									case "pattern":
										errorDetails.error = true;
										errorDetails.description=" '"+errorFields.join( " , ") +"' have invalid Pattern error";
										break;
									default:
										errorDetails.description="";
										break; 
								}
								break;//break for loop
							}
						}
					}
						return errorDetails;
				},	
				formSerialization:function(obj){
					if(angular.isArray(obj)){
						var returnObject = [];	
						obj.forEach(function(val){
							var tempObject ={};
							for(var key in val){
								if(val[key].hasOwnProperty("selectedResult"))
									tempObject[key] = val[key].selectedResult;
								else
									tempObject[key] = val[key];
							}
							returnObject.push(tempObject);
						});
						
						return returnObject;
					}
					else{
						var returnObject ={};
						for(var key in obj){
							if(obj[key].hasOwnProperty("selectedResult"))
								returnObject[key] = obj[key].selectedResult;
							else
								returnObject[key] = obj[key];
						}
						return returnObject;
					}
					
				}
	   		 };
		
	 });
