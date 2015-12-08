angular.module('testApp').controllerProvider
		.register(
				'testcasescontrlr',
				function($rootScope, $scope, $timeout,mobCheckFactory, $location,
						formvalidationFactory, serviceFactory,modalFactory) {
					$rootScope.regListheight = (window.innerHeight - 50) + "px";
					$scope.testcsHead = {
						title : "Project Info",
					};
					$scope.alert = {
						type : '',
						msg : ''
					};
					  $scope.open = function () {
						  var errorResponse = formvalidationFactory
							.formValidation($scope.testCasedetails.form);
					if (!errorResponse.error) {
						  	var options = {
						  			 templateUrl: 'html/jiralist.html',
								      controller: 'jiralistController',
								      dependencies :
			      	       	    	      [
			      	       	    	          'js/controllers/jiralist.js',
			      		       	    	      'js/factory/formvalidationFactory.js',
			      		       	    	      'js/factory/serviceFactory.js',
			      	       	    	      ]
						  	 		,items:{
						  	 			jiras:$scope.regBody.testcsBoxModel.JIRAS,
						  	 			prj:$scope.regBody.testcsBoxModel.name.selectedResult
						  	 		}
						  	};
						  	modalFactory.open(options);
					}
					else{
						$scope.alert.type = "danger";
						$scope.alert.msg = errorResponse.description;
					}
						  };
					$scope.testCasedetails = {
						form : null,
						buttons : {
							"add" : false,
							"edit" : true,
							"done" : false,
							"nav" : true,
							"del" : false,
						},
						readMode : true,
						projectdetails : true
					};
					$scope.deletedTstCases = [];
					$scope.changedTstCses = [];
					$scope.navtoRun = function(to) {
						if($scope.regBody.testcsBoxModel.JIRAS.currentJIRA!=""){
							mobCheckFactory.sessionStorer
							.setItem(
									'newProjectData',
									JSON
											.stringify($scope.regBody.testcsBoxModel));
							$location.path("/home/RunsList/" + to);
						}
						else{
							$scope.alert.type = "warning";
							$scope.alert.msg = "please select JIRA no:";
						}
					};
					$scope.gotoprjcts = function() {
						$location.path("/home/ProjectsList");
					};
					$scope.saveProject = function() {
						var errorResponse = formvalidationFactory
								.formValidation($scope.testCasedetails.form);
						if (!errorResponse.error) {
							$scope.regBody.testcsBoxModel.color = mobCheckFactory.colorCodes[Math
									.round(Math.random(1) * 10)];
							$scope.regBody.testcsBoxModel.prjid = JSON
									.parse(mobCheckFactory.sessionStorer
											.getItem('newProjectData')) ? JSON
									.parse(mobCheckFactory.sessionStorer
											.getItem('newProjectData')).prjid
									: new Date().getTime()
											+ "PR"
											+ $scope.regBody.testcsBoxModel.empid.selectedResult;
							$scope.changedTstCses = $scope.regBody.testcsBoxModel.testCases
									.filter(function(val) {
										if(val.isChanged){
											delete val._id;
											return true;
										}
									});
							if ($scope.changedTstCses.length > 0
									|| $scope.deletedTstCases > 0
									|| $scope.regBody.testcsBoxModel.name.isChanged
									|| $scope.regBody.testcsBoxModel.JIRANumber.isChanged) {
								var projDet = angular.copy($scope.regBody.testcsBoxModel);
								var jiras= projDet.JIRAS;
								delete projDet.testCases;
								delete projDet.JIRAS;
								delete projDet["_id"];
								serviceFactory.getData({
									url : '/saveProjectdetails',
									method : "POST",
									data : {
										chngd : $scope.changedTstCses,
										del : $scope.deletedTstCases,
										proj : projDet,
										jiras:jiras
									},
								}, $scope.ifregSuccess, $scope.iffail);
							} else {
								$scope.alert.type = "warning";
								$scope.alert.msg = "no changes made !!";
							}
						} else {
							$scope.alert.type = "danger";
							$scope.alert.msg = errorResponse.description;
						}
					};
					$scope.ifregSuccess = function(data) {
						if (data.status) {
							$scope.testCasedetails.buttons = {
									"add" : false,
									"edit" : true,
									"done" : false,
									"nav" : true,
									"del" : false,
								};
							$scope.testCasedetails.readMode = true;
							$scope.testCasedetails.projectdetails = false;
								
							$scope.alert.type = "success";
							$scope.alert.msg = data.message;
							mobCheckFactory.sessionStorer
									.setItem(
											'newProjectData',
											JSON
													.stringify($scope.regBody.testcsBoxModel));
							$scope.keepNewPorjctsinSession();
							$scope.deletedTstCases = [];
							$scope.changedTstCses = [];
						} else {
							$scope.alert.type = "danger";
							$scope.alert.msg = data.message;
						}
					};
					$scope.iffetchSuccess = function(data) {
						if (data.status) {
							$scope.regBody.testcsBoxModel = data.data;
							mobCheckFactory.sessionStorer
									.setItem(
											'newProjectData',
											JSON
													.stringify($scope.regBody.testcsBoxModel));
							$scope.keepNewPorjctsinSession();
						} else {
							$scope.alert.type = "danger";
							$scope.alert.msg = data.message;
						}

					};
					$scope.iffetchoftstjirasSuccess = function(data,currentProjects,i) {
						if (data.status) {
							if(data.data){
								currentProjects[i].JIRAS = {
										list : data.data.jir,
										currentJIRA:data.data.jir[0]
									};
								currentProjects[i].testCases = data.data.tst;
								$scope.onChangeJiras(data.data.jir[0].statcount);
								mobCheckFactory.sessionStorer.setItem('totDets',JSON.stringify(data.data.jir[0].statcount));
								mobCheckFactory.sessionStorer.setItem('currentProjects',JSON.stringify(currentProjects));
								$scope.regBody.testcsBoxModel = currentProjects[i];
								mobCheckFactory.sessionStorer
								.setItem(
										'newProjectData',
										JSON
												.stringify($scope.regBody.testcsBoxModel));
							}
						} else {
							$scope.alert.type = "danger";
							$scope.alert.msg = data.message;
						}

					};
					$scope.iffail = function(errorstat) {
						$scope.alert.type = "danger";
						$scope.alert.msg = "oops ! something is wrong tryAgain"
					};
					$scope.keepNewPorjctsinSession = function() {
						var currentProjects = JSON
								.parse(mobCheckFactory.sessionStorer
										.getItem('currentProjects'))
								|| [];
						currentProjects = currentProjects
								.filter(function(val) {
									return val.prjid != $scope.regBody.testcsBoxModel.prjid;
								});
						currentProjects.unshift($scope.regBody.testcsBoxModel);
						mobCheckFactory.sessionStorer.setItem(
								'currentProjects', JSON
										.stringify(currentProjects));
					};
					$scope.editTestcases = function() {
						$scope.testCasedetails.buttons = {
							"add" : true,
							"edit" : false,
							"done" : true,
							"nav" : false,
							"del" : true
						};
						$scope.testCasedetails.readMode = false;
						$scope.testCasedetails.projectdetails = true;
					};
					$scope.addTestCases = function() {
						var errorResponse = formvalidationFactory
								.formValidation($scope.testCasedetails.form);
						if (!errorResponse.error) {
							var newtestCase = {
								selectedResult : "",
								disabled : false,
								display : false,
								isChanged : true,
								toDelete : false,
								color : "",
								info : {
									tscsid : new Date().getTime()
											+ "TSC"
											+ $scope.regBody.testcsBoxModel.empid.selectedResult,
									currentRuncount : 0,
									succsCount : 0,
									failCount : 0,
									timeSpent : "0 hrs"
								}

							};
							newtestCase.color = mobCheckFactory.colorCodes[Math
									.round(Math.random(1) * 10)];
							$scope.regBody.testcsBoxModel.testCases
									.unshift(newtestCase);
							$scope.regBody.testcsBoxModel.count.selectedResult = $scope.regBody.testcsBoxModel.testCases.length;
						} else {
							$scope.alert.type = "danger";
							$scope.alert.msg = errorResponse.description;
						}
					};
					$scope.deletetestCase = function(i) {
						i.toDelete = true;
						$scope.deletedTstCases.push(i.info.tscid);
						$scope.regBody.testcsBoxModel.testCases = $scope.regBody.testcsBoxModel.testCases
								.filter(function(val) {
									return !val.toDelete;
								});
						$scope.regBody.testcsBoxModel.count.selectedResult = $scope.regBody.testcsBoxModel.testCases.length;
					};
					$scope.provideuserSessionData = function(i) {
						var wantd = JSON.parse(localStorage
								.getItem('currentUser')) ? JSON
								.parse(localStorage.getItem('currentUser')).data[i].selectedResult
								: false
						if (!wantd) {
							$rootScope.$apply(function() {
								$rootScope.logoff();
							});
						} else {
							return wantd;
						}
					};
				
				
					$scope.regBody = {
						testcsBoxModel : {
							prjid : "",
							JIRANumber : {
								selectedResult : "",
								placeHolder : "enter JIRA NO:",
								disabled : false,
								isChanged : true,
								toDelete:false,
								timstmp : "",
								readdate : "",
								status:{
									disabled:false,
										list : [ {txt: "Active",cls:"success"}, {txt: "InActive",cls:"default"}],
										selectedResult : "Active",
								}
							},
							JIRAS : {
								list : [],
								currentJIRA:""
							},
							Account : {
								selectedResult : $scope
										.provideuserSessionData("Account"),
							},
							empid : {
								selectedResult : $scope
										.provideuserSessionData("empid"),
							},
							name : {
								selectedResult : "",
								placeHolder : "enter Project Name",
								disabled : false,
								isChanged : true
							},
							color : "",
							count : {
								selectedResult : 0,
								placeHolder : "No:tst cases",
								disabled : true,
								type : mobCheckFactory.mobileCheck() ? "number"
										: "number"
							},
							testCases : []
						},
					};
					$scope.getProjectTestCases = function(ts) {
						serviceFactory.getData({
							url : '/fetchSelectdProjct/' + ts,
							method : "GET",
							cache : true,
						}, $scope.iffetchSuccess, $scope.iffail);
					};
					$scope.getProjectTestJiras = function(ts,currentProjects,i) {
						serviceFactory.getData({
							url : '/fetchtestandjiras/' + ts,
							method : "GET",
							cache : true,
						}, function(data){
							$scope.iffetchoftstjirasSuccess(data,currentProjects,i)
						}, $scope.iffail);
					};
					$scope.onChangeJiras = function(obj){
						 $timeout(function(){
		        				$scope.succ = obj.succ;
		 	        	    	$scope.fails = obj.fail;
		 	        	    	$scope.succPer = Math.round(($scope.succ/($scope.succ+$scope.fails))*100);
		 	        	    	$scope.failPer = 100-$scope.succPer;
		        			 },350);
					};
					$scope.regBoxmodel = [];
					(function() {
						var pathLocation = $location.$$url.split("/");
						var endID = pathLocation[pathLocation.length - 1];
					    $scope.regBoxmodel = JSON.parse(mobCheckFactory.sessionStorer.getItem('allUsers')) || [];
						var role = $scope.provideuserSessionData("role");
						if (role == "Admin") {
							if (endID === "new") {
								$scope.testCasedetails.buttons = {
									"add" : true,
									"edit" : false,
									"done" : true,
									"nav" : false,
									"del" : true,

								};
								$scope.testCasedetails.readMode = false;
								$scope.testCasedetails.projectdetails = true;
							} else {
								$scope.testCasedetails.buttons = {
									"add" : false,
									"edit" : true,
									"done" : false,
									"nav" : true,
									"del" : false,

								};
								$scope.testCasedetails.readMode = true;
								$scope.testCasedetails.projectdetails = false;
							}
						} else {
							$scope.testCasedetails.buttons = {
								"add" : false,
								"edit" : false,
								"done" : false,
								"nav" : true,
								"del" : false,

							};
							$scope.testCasedetails.readMode = true;
							$scope.testCasedetails.projectdetails = false;
						}
						if (endID === "new") {
							mobCheckFactory.sessionStorer.setItem(
									'newProjectData', null);
						} else {
							var currentProjects = JSON
									.parse(mobCheckFactory.sessionStorer
											.getItem('currentProjects'))
									|| [];
							if (currentProjects.length > 0) {
								var projectFound = false;
								for ( var i = 0; i < currentProjects.length; i++) {
									if (currentProjects[i].prjid == endID) {
										if(
												currentProjects[i].hasOwnProperty("JIRAS") 
												
										  ){
											$scope.regBody.testcsBoxModel = currentProjects[i];
											mobCheckFactory.sessionStorer
											.setItem(
													'newProjectData',
													JSON
															.stringify($scope.regBody.testcsBoxModel));
											var dump = JSON.parse(mobCheckFactory.sessionStorer.getItem('totDets'));
											if(dump)
												$scope.onChangeJiras(dump);
											
										}
										else{
												$scope.getProjectTestJiras(endID,currentProjects,i);
										}
										
										projectFound = true;
										break;
									}
								}
								if (!projectFound) {
									$scope.getProjectTestCases(endID);
								}
							} else {
								$scope.getProjectTestCases(endID);
							}
						}
					})();
				});
