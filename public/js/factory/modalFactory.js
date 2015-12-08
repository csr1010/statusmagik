angular.module('testApp').provide.service('modalFactory',   function($http,$modal) {
return {
    open: function(options) {
        var modalInstance = $modal.open({
		      templateUrl: options.templateUrl,
		      controller: options.controller,
		      size: "",
		      resolve: {
	       	      deps:function($q, $rootScope)
	       	    	  {
	       	    	      var deferred = $q.defer();
	       	    	      var dependencies = options.dependencies;
	       	    	      $script(dependencies, function()
	       	    	      {
	       	    	          $rootScope.$apply(function()
	       	    	          {
	       	    	              deferred.resolve();
	       	    	          });
	       	    	      });
	       	    	      return deferred.promise;
	       	    	  },
	       	    	items: function () {
	       	          return options.items;
	       	        }
	       	
		      }
		    });
        modalInstance.result.then(function () {
		      console.log("ok");
		    }, function () {
		    	console.log("okcncl")
		    });
        return modalInstance;
    },
};
});