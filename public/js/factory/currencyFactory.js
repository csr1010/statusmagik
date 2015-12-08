angular.module('testApp').provide.service('currencyFactory', function($rootScope,$http) {
	var availbeCountries = ["INR"],q="";
	return currencyJSONP ={
				 results:{},
				 worklocations:[],
				 currencyType:[],
				 ajaxcall : function(){
	 var url = "http://www.freecurrencyconverterapi.com/api/convert?q="+q+"&compact=y&callback=JSON_CALLBACK";
						$http.jsonp(url).
						    success(function(data, status, headers, config) {
						    	currencyJSONP.results = data;
						    }).
						    error(function(data, status, headers, config) {
						       console.log(status);
						    });	
				 },
				 getavailblecountries:function(){
					 $http({
				            url: '/currency/'+account,
				            method: "GET",
				        }).success(function (result, status, headers, config) {
				        	if(result.status)
				        	{
				        		currencyJSONP.worklocations = angular.copy(result.data.worklocations);
				        		currencyJSONP.currencyType = angular.copy(result.data.currencytypes);
				        		currencyJSONP.currencyType.forEach(function(val,indx){
					        		if(indx < currencyJSONP.currencyType.length-1)
					        			q+=val+"-USD,";
					        		else
					        			q+=val+"-USD";
					        	});
					        	currencyJSONP.ajaxcall();
				        	}
				        	else{
				        		alert(result.message);
				        	}
				        }).error(function (data, status, headers, config) {
				            	alert("some thing is wrong in country fetching"+status);
				            });
				 }
		 };
	 });