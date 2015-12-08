angular.module('testApp').filterProvider.register('filterarray', function() {
	return function(items, field) {
	  if(field){
		  var filteredArray,key;
		  for(var i in field){ 
			  key = i;
			  filteredArray = field[i].selectedResult;
			}
		  if(field[key].selectedResult.length > 0){
			  var dummy  = [];
			  dummy = items.filter(function(val,indx){
						for(var i in filteredArray){
							if(
								   val[key].selectedResult.toString().toLocaleLowerCase().indexOf(filteredArray[i].toLocaleLowerCase()) > -1
									  
							 )
								return true;
						}
					});
		      return dummy;
		  }
		  
		  else
			  return items;
	  }
	  else
		  return items;
     //console.log(field.skillcast.selectedResult);
  };
});