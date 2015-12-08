testApp.config(function($routeProvider,$locationProvider,$provide) {
  $routeProvider.when('/inf', {
      controller:'InflectController',
      templateUrl:'../priceelasticity/html/Inflection.html',
      resolve:{deps:function($q, $rootScope)
    	  {
    	      var deferred = $q.defer();
    	      var dependencies =
    	      [
    	          '../controllers/Inflections.js'
    	      ];
    	   
    	      // Load the dependencies
    	      $script(dependencies, function()
    	      {
    	          // all dependencies have now been loaded by so resolve the promise
    	          $rootScope.$apply(function()
    	          {
    	              deferred.resolve();
    	          });
    	      });
    	   
    	      return deferred.promise;
    	  }}
    });
});
