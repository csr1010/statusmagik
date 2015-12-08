	var  returnMessage ={
			data:{},
			message:"",
			status:false
	};
	function addnew(x,account,res,y){
	if(x.length>0){
		x[0].info.isChanged = false;
		x[0].info.isChangedtoNeutral = false;
			db.users.update({empid:x[0].empid},
					{$set:{
					 info:x[0].info,
					 status:x[0].status,
					 role:x[0].role,
					 
					 Account:x[0].Account,
					 
					 contact:x[0].contact,
					 transferTO:x[0].transferTO,
					 chckybox:x[0].chckybox,
					 empid:x[0].empid,
					 name:x[0].name,
					}
			       },{upsert:true},function(){
						
					});
					}
				if(x.length!=0){
					x.shift();
					addnew(x,account,res,y);
					}
			    else{
					db.users.update({
		'info.isExisting':false,
		'Account.selectedResult':account,
	},{$set:{
		'info.isExisting':true,
		'pwd.selectedResult':"root"
	}},{multi:true},function(){
		db.users.remove(
				{
				  'empid.selectedResult':{$in:y},
				  'Account.selectedResult':account,
				},function(err,doc){
			if(doc){
				returnMessage.status=true;
	        	returnMessage.message ="changes made successfully";
				res.jsonp(returnMessage);
		 }
		}
		);	
	});
				}
		
		};
	function updateTransfers(x){
		db.nflData.update(
				{
					'info.userEMPID':x[0].empid
				},
				{$set:{
					'info.userEMPID':x[0].trandfrID
				}
				},
				{
					multi:true
				},
				function(){
					x.shift();
					if(x.length!=0)
						updateTransfers(x);
				});
	};
	exports.createAdmin = function(req, res) {
		var x =req.body;
		var empid = req.body.empid.selectedResult;
		delete x.Account.list;
		db.users.update({'empid.selectedResult':empid},x,{upsert:true},function(err,doc){
			if(doc){
				returnMessage.status=true;
	        	returnMessage.message ="Registered successfully";
				res.jsonp(returnMessage);
		 }
		});
	};
	exports.create = function(req, res) {
	var x =req.body.postData;
	var y = req.body.deleters;
	var account = req.body.account;
	addnew(x,account,res,y);
	
	
  };
  exports.findallusers = function(req, res){
	  var accountID = req.params.account;
	  var admin={
					info : {
						disabled : true,
						classy : false,
						isChanged:false,
						tobeDeleted:false,
						isExisting:true,
						isChangedtoNoRole:false
					},
					chckybox : {
						selectedResult : false,
					},
					empid : {
						type : "number",
						selectedResult : 533135,
						placeHolder : "EMP ID",
					},
					name : {
						selectedResult : "TestMagik_Universal_Admin",
						placeHolder : "EMP NAME",
					},
					transferTO:{
						selectedResult : "",
						transferDone:false
					},
					contact:{
							type :"number",
						selectedResult : 9003655855,
						placeHolder : "CONTACT NO:",
					},
					Account : {
						selectedResult :"",
						placeHolder : "Account",
						disabled : true
					},
					role : {
						 
						list : [ "Admin", "SubOrdinate", "NoRole" ],
						selectedResult : "NoRole",
					},
					status : {
						list : [ {txt: "Active",cls:"success"}, {txt: "InActive",cls:"default"}],
						selectedResult : "Active",
					}
}	  //console.log(accountID);
	  db.users.find({
     		"Account.selectedResult":accountID
		}, function(err, doc) {
			 if(doc == null){
				   	returnMessage.status=false;
		        	returnMessage.message ="No users found";
					res.jsonp(returnMessage);
			   }
			 else{
				 	returnMessage.data=doc;
					returnMessage.data.unshift(admin);
					returnMessage.status=true;
		        	returnMessage.message ="Users fetched Successfully";
					res.jsonp(returnMessage);
			 }
		});
  };
 exports.getcurrencyCodes = function(req, res){
	 var accountID = req.params.account;
	 db.accounts.findOne({
			'fullname.selectedResult':accountID
		}, function(err, doc) {
			 if(doc == null){
				   	returnMessage.status=false;
		        	returnMessage.message ="No account found ";
					res.jsonp(returnMessage);
			   }
			 else{
				 	returnMessage.data=doc;
					returnMessage.status=true;
		        	returnMessage.message ="success";
					res.jsonp(returnMessage);
			 }
		});
 };
 exports.findbyID = function(req, res) {
	    var nempid = Number(req.body.empid);
		var sempid = req.body.empid.toString();
		var pwd = req.body.pwd;
		db.users.findOne({
			'empid.selectedResult':	{ $in : [ sempid, nempid ] } 
		}, function(err, doc) {
		   if(doc == null){
			   	returnMessage.status=false;
	        	returnMessage.message ="Dear  " +nempid+ ",it seems you haven't registered yet,Please register"
				res.jsonp(returnMessage);
		   }
		   else{
		    		if(doc !=null  && doc.hasOwnProperty('pwd') && 
							doc.status.selectedResult=="Active" &&
							doc.role.selectedResult!="NoRole" &&
							doc.pwd.selectedResult == pwd && 
							doc.hasOwnProperty('empid') && 
							doc.empid.selectedResult.toString() == nempid.toString()){
						
						delete doc.pwd;
						doc.path={
								url:"/home/ProjectsList",
								method:"path",
						};
						returnMessage.data=doc;
						returnMessage.status=true;
			        	returnMessage.message ="success";
						res.jsonp(returnMessage);
					}
					else{
						returnMessage.status=false;
			        	returnMessage.message ="Dear  " +nempid + ", your credentials seems Invalid, or 'NO Access' please contact Admin"
						res.jsonp(returnMessage);
					}
				}
			});
			
  };
