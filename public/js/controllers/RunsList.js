angular.module('testApp').controllerProvider.register('RunsListController',
		function($scope, serviceFactory, mobCheckFactory,$timeout,formvalidationFactory,$location,$rootScope,$window,timerFactory,$cacheFactory) {
			$scope.alert = {
				type : '',
				msg : '',
				endID:"",
				JIRA:"",
				jiraStatus:"",
				form:null,
				moreBut:true,
				lessbut:false,
				buttns:{
					strt:true,
					hold:false,
					cont:false,
					end:true,
					save:true,
					add:true,
				}
			};
			$scope.provideuserSessionData = function(i){
				var wantd =  JSON.parse(localStorage.getItem('currentUser')) ?
						JSON.parse(localStorage.getItem('currentUser')).data[i].selectedResult : false;
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
			
			$scope.regBody = { 
				oldrunBoxmodel : [],
				runBoxmodel : [{
					//runid: new Date().getTime() +"RUN"+$scope.provideuserSessionData("empid"),
					info:{
						JIRANumber:$scope.alert.JIRA,
						projID:JSON.parse(mobCheckFactory.sessionStorer.getItem('newProjectData')).prjid, 
						tstCASID:$scope.alert.endID 
					},
					Account:{
						selectedResult:$scope.provideuserSessionData("Account"),
					},
					empid:{
						selectedResult:$scope.provideuserSessionData("empid"),
					},
					runid:new Date().getFullDate(new Date()),
					description:[
					             {
					            	 toDelete :false,
						selectedResult:"",
						placeHolder:"Task description",
						selected:false,
					}]
				}
             ]
			};
				$scope.showprev=function(){
					var tcid = $scope.alert.endID;
				var id = new Date().getFullDate(new Date());
				var dummObj = {};
				dummObj[tcid] =[];
				var obj =JSON.parse(mobCheckFactory.sessionStorer.getItem('runData')) || dummObj;
				if(obj.hasOwnProperty(tcid) && obj[tcid].length>0){
					obj[tcid].forEach(function(val){
						if(val.runid == id)
						$scope.regBody.runBoxmodel[0].description = $scope.regBody.runBoxmodel[0].description.concat(val.description);	
					});
					
				}	
			};
			$scope.more = function(){
				//$scope.alert.lessbut = true;
				//$scope.alert.moreBut = false;
				var currentJIRA = $scope.alert.JIRA;
					var tstcasId = $scope.alert.endID ;
					$scope.getrunbyJIRA(currentJIRA+"_"+tstcasId+"_"+new Date().getFullDate(new Date(),"-"));
			};
		
			(function(){
				var pathLocation = $location.$$url.split("/");
				$scope.alert.endID = pathLocation[pathLocation.length-1];
				$scope.alert.JIRA = JSON.parse(mobCheckFactory.sessionStorer.getItem('newProjectData')).JIRAS.currentJIRA.selectedResult;
				$scope.alert.jiraStatus = JSON.parse(mobCheckFactory.sessionStorer.getItem('newProjectData')).JIRAS.currentJIRA.status.selectedResult;
				$scope.regBody.runBoxmodel[0].info.JIRANumber =$scope.alert.JIRA ;
				$scope.regBody.runBoxmodel[0].info.tstCASID = $scope.alert.endID  ;
				$scope.showprev();
				if($scope.alert.jiraStatus !="Active"){
					//$scope.regBody.runBoxmodel = [];
					$scope.alert.buttns.save = false;
					$scope.alert.buttns.add = false;
					
				}
				else{
					
					//timerFactory.eventdelgt();
				}
				
			})();
			$rootScope.regListheight = (window.innerHeight - 50) + "px";
			$scope.gettstTitle = function(){
				var dump = JSON.parse(mobCheckFactory.sessionStorer.getItem('newProjectData'))?
						    JSON.parse(mobCheckFactory.sessionStorer.getItem('newProjectData')).testCases : false;
						    if(!dump){
						    	$location.path("/home/ProjectsList");
						    }
				var title="";
				for(var j = 0 ; j < dump.length ; j++){
					if(dump[j].info.tscsid == $scope.alert.endID){
						title = dump[j].selectedResult;
						break;
					}
				}
				return title;
			};
			$scope.regHead = {
				title : $scope.gettstTitle() ,
			};
			$scope.gototestcases = function(){
				//$window.history.back();
				var ts  = 
					JSON.parse(mobCheckFactory.sessionStorer.getItem('newProjectData')) ? 
						JSON.parse(mobCheckFactory.sessionStorer.getItem('newProjectData')).prjid : "new";
						$location.path("/home/testcases/"+ts);
			};
			$scope.runDescs=[ ];
			$scope.addRunissue = function(){
				var errorResponse = formvalidationFactory.formValidation($scope.alert.form);
				if(!errorResponse.error ){
					var newrunIssue  =  {
							toDelete :false,
							selectedResult:"",
							placeHolder:"Task description",
							selected:false,
							
						};
					
					$scope.regBody.runBoxmodel[0].description.forEach(function(val,indx){
						if($scope.runDescs.indexOf(val.selectedResult) == -1)
							$scope.runDescs.unshift(val.selectedResult);
					});
					
					$scope.regBody.runBoxmodel[0].description.unshift(newrunIssue);
				}else{
					$scope.alert.type = "danger";
			    	$scope.alert.msg = errorResponse.description;
				}
			};
			 $scope.ifregSuccess = function(data){
	        	    if(data.status){
	        	    	$scope.alert.type = "success";
	        	    	$scope.alert.msg = data.message;
	        	    	$scope.keepNewPorjctsinSession();
	        	    	 mobCheckFactory.sessionStorer.setItem('totDets',JSON.stringify(data.data.totCount));
	        	    }else{
	        	    	$scope.alert.type = "danger";
	        	    	$scope.alert.msg = data.message;
	        	    }
	            };
			  $scope.iffetchSuccess = function(data){
	        	    if(data.status){
	        	    	$scope.currentRunCount =  data.data.runs;

	        			 $timeout(function(){
	        				$scope.succ = data.data.succ;
	 	        	    	$scope.fails = data.data.fails;
	 	        	    	$scope.succPer = Math.round(($scope.succ/($scope.succ+$scope.fails))*100);
	 	        	    	$scope.failPer = 100-$scope.succPer;
	        			 },350);
	        	    	
	        	    }else{
	        	    	$scope.currentRunCount =  1;
	        	    }
	            };
			  $scope.iffetch2Success = function(data){
	        	    if(data.status){
	        	    	$scope.regBody.oldrunBoxmodel = data.data;
	        	    	$scope.keepoldPorjctsinSession();
	        	    }else{
	        	    	$scope.alert.type = "danger";
	        	    	$scope.alert.msg = data.message;
	        	    }
	            
			  };
						 $scope.iffail = function(errorstat){
							 	$scope.alert.type = "danger";
						    	$scope.alert.msg = "oops ! something is wrong tryAgain";
						 };
			$scope.saveruns= function(param,runid){
				var errorResponse = formvalidationFactory.formValidation($scope.alert.form);
				var data = $scope.regBody.runBoxmodel[0];
				if(param>0){
					for(var i in $scope.regBody.oldrunBoxmodel){
						if($scope.regBody.oldrunBoxmodel[i].runid == runid){
							data = $scope.regBody.oldrunBoxmodel[i];
							delete data._id;
							break;
						} 
					}
				}
				if(!errorResponse.error || param > 0){
					 serviceFactory.getData({
				            url: '/saveRundetails',
				            method: "POST",
				            data: data,
				        },function(data){
				        	$scope.ifregSuccess(data);
				        },$scope.iffail);
				}
				else{
					$scope.alert.type = "danger";
			    	$scope.alert.msg = errorResponse.description;
				}
			};
			$scope.keepNewPorjctsinSession=function(){
				var hasProp = false;
				var obj =JSON.parse(mobCheckFactory.sessionStorer.getItem('runData')) || {};
    	    	obj.hasOwnProperty($scope.regBody.runBoxmodel[0].info.tstCASID) 
    	    	    ? hasProp = true 
    	    	     : obj[$scope.regBody.runBoxmodel[0].info.tstCASID] = $scope.regBody.runBoxmodel[0];
    	    	if(hasProp){
    	    		var temp = obj[$scope.regBody.runBoxmodel[0].info.tstCASID];
    	    		if(!angular.isArray(temp)){
    	    			dump = [temp];
    	    		}
    	    		else{
    	    			dump = temp;
    	    		}
    	    		for(var j = 0 ; j < dump.length ; j++){
    					if(dump[j].runid == $scope.regBody.runBoxmodel[0].runid){
    						dump.splice(j,1);
    						break;
    					}
    	    		}
    					dump.unshift($scope.regBody.runBoxmodel[0]);
    	    	}else{
    	    		var newdescs = $scope.regBody.runBoxmodel[0].description;
    	    		var olddesc = obj[$scope.regBody.runBoxmodel[0].info.tstCASID].description;
    	    		var mixeddesc = newdescs.concat(olddesc);
    	    		obj[$scope.regBody.runBoxmodel[0].info.tstCASID].description = mixeddesc;
    	    	}
    	    	
    	    	mobCheckFactory.sessionStorer.setItem("runData",JSON.stringify(obj));
			};
			$scope.keepoldPorjctsinSession=function(){
				var obj =JSON.parse(mobCheckFactory.sessionStorer.getItem('runData')) || {};
				$scope.regBody.oldrunBoxmodel.forEach(function(val,indx){
					if(indx==0) obj[val.info.tstCASID]=[];
					obj[val.info.tstCASID].unshift(val);
				});
    	    	mobCheckFactory.sessionStorer.setItem("runData",JSON.stringify(obj));
			};
		/*	$scope.getCountFromDB = function(id){
				var dummObj = {};
				dummObj[id] =[];
				var obj =JSON.parse(mobCheckFactory.sessionStorer.getItem('runData')) || dummObj;
				return obj.hasOwnProperty(id) ? obj[id].length+1 : 1;
			};*/
			$scope.currentRunCount = 0;
			$scope.ifrunsuccs = function(){
				$scope.regBody.runBoxmodel[0].description=[];
				$scope.regBody.runBoxmodel[0].issueCount.selectedResult = $scope.regBody.runBoxmodel[0].description.length;
				$scope.regBody.runBoxmodel[0].issueCatgory.selectedResult ="none";
			};
			$scope.deleterunIssue = function(i,param,out){
				i.description=i.description.filter(function(val){
						return !(param.$$hashKey == val.$$hashKey);
				});
			};
			
			$scope.hideprev=function(){
				$scope.alert.lessbut = false;
				$scope.alert.moreBut = true;
					$scope.regBody.oldrunBoxmodel = [];
			};
			$scope.getrunbyJIRA = function(ts){
				serviceFactory.getData({
		            url: '/fetchSelectdRUNJIRA/'+ts,
		            method: "GET",
		            cache:false,
		        },$scope.iffetch2Success ,$scope.iffail);
			};
				(function(){
					$scope.more();
				})();
		});