var globalModel = (function() {
	return{
		gloabal :null,
		models:{
			
		},
		controllers:{
			
		},
		isopen:true,
		animateTimer:null,
		initApp:function(){
				 
				    globalModel.controllers.showmemories.scatter();
				    globalModel.models.showmemories.modeltoView.renderUI();
		         	globalModel.models.showmemories.modeltoView.onAfterLoad();
     			 
			
				globalModel.controllers.showmemories.dance.call(this);
   			
				 
		},
		utils:{

	    	modelTohtml:function(){
	    		var currentModel = this;
	    		   $.ajaxSetup({async:false});
	    		   $.get($.trim(currentModel.templateAT.split("#")[0]), function(template){
	    			   var itemplate = $(template).filter('#target').html();
	    				  Mustache.to_html(itemplate, currentModel.thisModel,"",function(result){
	    					  document.getElementById(currentModel.domEl).innerHTML  = result;
	    					 //   $().html(result);
	    				  }); 
	    			  });
	    	   },
	    	eventbinders:function(val){
    			var eventsList = val["events"] || [];
    			eventsList.forEach(function(element, index) {
    				if(element.hasOwnProperty("name")){
    	    			$("input[name="+element.name+"]:radio")[element.type](element.callback);
    	    		}
    				else if(element.hasOwnProperty("node")){
    					$(element.node)[element.type](element.callback);
    	    		}
    	    		else if(element.hasOwnProperty("classy")){
    					$("."+element.classy)[element.type](element.callback);
    	    		}
    	    		else
    	    			$("#"+element.id)[element.type](element.callback);
    			});
	    	},   
	    	eventHandlers:function(){
	    		var currentModel = this;
	    		$.each(currentModel.thisModel, function(key,valueObj){
	    			if(typeof(valueObj)=="object" && typeof(valueObj.length) == "number"){
	    				valueObj.forEach(function(val,i){
	    					globalModel.utils.eventbinders(val);
	    				});
	    			}
	    			else{
	    				globalModel.utils.eventbinders(valueObj);

	    			}
	    		});
	    		
	    	}
	    
		}
	}
})();