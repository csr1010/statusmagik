angular.module('testApp').provide.service('serviceFactory',   function($http,mobCheckFactory,$timeout) {
return {
    getData: function(options,Scallback,Fcallback) {
    		mobCheckFactory.Blocker.create();
        $http(options)
        .success(function(data) {
        		mobCheckFactory.Blocker.destroy();
            return Scallback(data);
        })
        .error(function(data,stat) {
        	mobCheckFactory.Blocker.destroy();
            return Fcallback(stat);
        });
    },
    movNormal:function(){
    	$(".leftnavclass .nonfilgridsholder").addClass("inleft");
    	$(".leftnavclass .nonfilgridsholder").addClass("movenorml");
    	$timeout(function(){
    		$(".leftnavclass .nonfilgridsholder").removeClass("inleft");
    	},302);
    },
};
});