var  nflreturnMessage ={
			data:{},
			message:"",
			status:false
	};
var curntObjct = this;
exports.insertAll = function(req, res) {
	var thisweekrange =   curntObjct.calcFallinweek();
	var empGroup=[];
	req.body.forEach(function(val,indx){
		if(indx == 0 )  empGroup.unshift(val.info.userEMPID);
		if(val.info.userEMPID != empGroup[0])
			empGroup.unshift(val.info.userEMPID);
	});
	
	db.nflData.remove(
			{'info.userEMPID':{$in:empGroup},'dateRange.fallinWeek':thisweekrange},function(err,suc){
				db.nflData.insert(req.body,function(error,success){
			        if(error)
			        {
			        	console.log(error)
			        	nflreturnMessage.status=false;
			        	nflreturnMessage.message ="data could not be saved, please try again !!";
						res.jsonp(nflreturnMessage);
			        }
			        else
			        {
			        	db.nflData.remove(
			    				{
			    				  'info.tobeDeleted':true,
			    				}
			    		);	
			        	nflreturnMessage.status=true;
			        	nflreturnMessage.message ="Non-fullfilment data saved successfully";
						res.jsonp(nflreturnMessage);
			        }
			});
			});
  };
  curntObjct.calcFallinweek = function(){
		var curntWeekRange = "";
			var today = new Date();
			var todaysWeekNumber = today.getDay();
			
			var weekbeginDate  = new Date( today.getTime() - (todaysWeekNumber * 8.64e+7));
			var weekEndDate =  new Date( weekbeginDate.getTime() + (6 * 8.64e+7));
			
			curntWeekRange = weekbeginDate.getFullDate(weekbeginDate) + "-" + weekEndDate.getFullDate(weekEndDate);
			
		return curntWeekRange;
	};
	  exports.fetchdefaultersNFL = function(req,res){
		  var fromdate = req.body.fromdate;
		  var todate =  req.body.todate;
		  
		  db.nflData.distinct('info.Account',
				 {'dateRange.savedDate':{$gte:fromdate} }
				 ,{'dateRange.savedDate':{$lte:todate} },function(err,doc){
					 if(doc!=null){
					  db.accounts.find({'fullname.selectedResult':{$nin:doc}},function(err,doc){
						  nflreturnMessage.data=doc;
							 nflreturnMessage.status=true;
							 nflreturnMessage.message ="Defaulters for the selected week ranges";
							res.jsonp(nflreturnMessage);
					  });
					 }
				 }
		  )
		  
	  };
  exports.fetchSelctd = function(req,res){
	  var fromdate = req.body.fromdate;
	  var todate =  req.body.todate;
	  var userEMPs = req.body.userEMPID;
	  var account = req.body.Account;
	  var role = req.body.role;
	  var userArray = [userEMPs];
	  var thisweekrange =   curntObjct.calcFallinweek();
		db.accounts.find(
				{
					'fullname.selectedResult':account 	
				},
			  function(err,doc) {
				if(doc!=null && doc.length>0){	
				  if(role =="Admin"){
					  doc[0]["subords"].forEach(function(val){
						  if(userArray.indexOf(val.empid)<0){
							  userArray.push(val.empid);
						  } 
					  }); 
					  doc[0]["admins"].forEach(function(val){
						  if(userArray.indexOf(val.empid)<0){
							  userArray.push(val.empid);
						  } 
					  }); 
				  }	
				  else if(role =="SubOrdinate"){
					  doc[0]["admins"].forEach(function(val){
						  if(userArray.indexOf(val.empid)<0){
							  userArray.push(val.empid);
						  } 
					  }); 
				  }
				  db.nflData.update(
						  {"dateRange.fallinWeek":{$ne:thisweekrange}}, 
						  {$set:{'info.disabled':true,'info.classy':true}}, 
						  {multi:true}, function(err,done) {
							  var impObj = {};
							  if(account !="TCS Internal"){
								  impObj={'info.userEMPID':{$in:userArray}};
							  }
					  	  db.nflData.find(
								   {$and :[impObj, {'dateRange.savedDate':{$gte:fromdate} }
								  ,{'dateRange.savedDate':{$lte:todate} } ]} , function(err,doc){
									  if(doc == null){
										  nflreturnMessage.status=false;
										  nflreturnMessage.message ="No records found for give time span";
										  res.jsonp(nflreturnMessage);
									   }
									 else{
										 if(doc.length == 0 ){
											 nflreturnMessage.status=false;
											  nflreturnMessage.message ="No records found for give time span";
											  res.jsonp(nflreturnMessage);
										 }
										 else{
											 nflreturnMessage.data=doc;
											 nflreturnMessage.status=true;
											 nflreturnMessage.message ="Records found for selcted date ranges";
											res.jsonp(nflreturnMessage);
										 }
									 }
								  }
								  );
						  });
				}
				else{
					 nflreturnMessage.status=false;
					 nflreturnMessage.message ="Acccount Info Not found ";
					res.jsonp(nflreturnMessage);
				}
			  });
				


  };