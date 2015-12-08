angular.module('testApp').controllerProvider.register('jiralistController', function(
		$scope,$modalInstance,items,formvalidationFactory)
{
	 $scope.alert =  { 
	                	type: '',
	                	msg: '' 
	                  };
	 $scope.JIRAS=items.jiras;
	 $scope.projectName=items.prj;
	 $scope.jiraFormdetails = {
				form : null,
	 };
	$scope.editZera = true;
	$scope.saveZera = false;
	 $scope.JIRANumber = {
			selectedResult : "",
			placeHolder : "enter PHASE NO:",
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
	 };
		$scope.editJiras = function(i) {
			var errorResponse = formvalidationFactory
			.formValidation($scope.jiraFormdetails.form);
			if (!errorResponse.error) {
				i.disabled=false;
				$scope.saveZera=true;
				$scope.editZera=false;
			}
				else {
					$scope.alert.type = "danger";
					$scope.alert.msg = errorResponse.description;
				}
		};
		$scope.saveeditedJiras = function(i) {
			var errorResponse = formvalidationFactory
			.formValidation($scope.jiraFormdetails.form);
			if (errorResponse.error) {
			$scope.alert.type = "danger";
			$scope.alert.msg = errorResponse.description;
		}
			else{
				i.disabled=true;
				$scope.saveZera=false;
				$scope.editZera=true;
			}
		};
		$scope.addJiras = function() {
			if ($scope.JIRANumber.selectedResult.toString().trim() != "") {
				$scope.JIRANumber.timstmp = new Date()
						.getTime();
				$scope.JIRANumber.readdate = new Date()
						.getFullDate($scope.JIRANumber.timstmp);
				var x = angular
						.copy($scope.JIRANumber);
				x.disabled=true;
				var flg = false;
				for(var i=0;i<$scope.JIRAS.list.length;i++){
					$scope.JIRAS.list[i].status.selectedResult = "InActive";
					$scope.JIRAS.list[i].status.list[1].cls="danger";
					$scope.JIRAS.list[i].status.list[0].cls="default";
					$scope.JIRAS.list[i].status.disabled = true;
					if($scope.JIRAS.list[i].selectedResult == x.selectedResult){
						flg=true;	
					}
				}
				if(!flg){
					$scope.JIRAS.list.unshift(x);
					$scope.JIRAS.currentJIRA=$scope.JIRAS.list[0];
					$scope.JIRANumber.selectedResult = "";
				}
				else{
					$scope.alert.type = "danger";
					$scope.alert.msg = "PHASE already exists !!";
				}
			} else {
				$scope.alert.type = "danger";
				$scope.alert.msg = "please fill in PHASE to add NEW one";
			}
		};
	  $scope.ok = function () {
		    $modalInstance.close();
		 };

	 $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
	  };
});