var  prjreturnMessage ={
			data:{},
			message:"",
			status:false
	};
	var tstJIRAobj = {
					tst:[],
					jir:[]
				};
var curntObjct = this;
exports.createProject = function(req, res) {
	var x =req.body;
		var projectData = x.proj;
		var prjID = projectData.prjid ;
		var accountName = projectData.Account.selectedResult ;
		
		var testcaseChanges = x.chngd;
		var testcasedeleted = x.del;
		var activeJIRA = x.jiras.list || [];
	 
	 
			   db.projects.update({'prjid':prjID,'Account.selectedResult':accountName},projectData,{upsert:true},function(err,doc){
				if(doc){
					
					if(testcaseChanges.length>0){
						addnew(testcaseChanges,testcasedeleted,activeJIRA,prjID,res);
					}
					else if(testcasedeleted.length > 0 ){
						delet(testcasedeleted,activeJIRA,prjID,res);
					}
					else{
						addJIRA(activeJIRA[0],prjID,res);
					}
					

			 }
			 	else{
				console.log(err)

						prjreturnMessage.status=false;
						prjreturnMessage.data="";
						prjreturnMessage.message =err;
						res.jsonp(prjreturnMessage);
					}					
			});
		   
		
	 };
 function addJIRA(x,projid,res){
 if(x  && x.hasOwnProperty("isChanged") && x.isChanged){
  x.prjid=projid;
  x.isChanged =false;
 db.JIRA.update({prjid:projid},{$set:{ 
					'status.selectedResult' : 'InActive',
					'status.list.1.cls':'danger',
					'status.list.0.cls':'default',
					'status.disabled ': true,
 } },{multi:true},function(err,doc){
	if(doc){
		db.JIRA.update({'timstmp':x.timstmp,prjid:projid},
					x,{upsert:true},function(err,doc){
				 if(doc){
				 	prjreturnMessage.status=true;
					prjreturnMessage.message ="project saved successfully";
					res.jsonp(prjreturnMessage);
				 }
			});
		}
	else{
	//console.log("jira"+err)
		  prjreturnMessage.status=false;
						prjreturnMessage.message =err;
						res.jsonp(prjreturnMessage);
		}
  
  });
  }
  else{
   		prjreturnMessage.status=true;
		prjreturnMessage.message ="project saved successfully";
		res.jsonp(prjreturnMessage);
  }
};
 function addnew(x,y,z,projid,res){
 		x[0].isChanged = false;
		x[0].prjid=projid;
		delete x[0]["_id"];
		db.testcases.update({'info.tscsid':x[0].info.tscsid,prjid:projid},
					x[0],{upsert:true},function(err,doc){
				if(doc)	{
					x.shift();
					if(x.length!=0)
						addnew(x,y,z,projid,res);
					else{
						 if(y.length > 0 ){
							delet(y,z,projid,res);
						}
						else{
							addJIRA(z[0],projid,res);
						}
							
					}
				}
				else{
				console.log(err)
					  prjreturnMessage.status=false;
						prjreturnMessage.message =err;
						res.jsonp(prjreturnMessage);
					}
			});
		};
 function delet(x,y,projid,res){
	db.testcases.remove({'info.tscsid':{$in:x}},function(err,doc){
							 if(doc){
								addJIRA(y[0],projid,res);
							 }
						});
		};
exports.createrun = function(req, res) {
	var x =req.body;
		var objectID = req.body.runid ;
		var accountName = req.body.Account.selectedResult ;
		var jiraNumber = req.body.info.JIRANumber;
		db.runlist.update({'runid':objectID,'Account.selectedResult':accountName},x,{upsert:true},function(err,doc){
			if(doc){
			 
							prjreturnMessage.status=true;
							prjreturnMessage.data={
								totCount:0,
							};
							prjreturnMessage.message ="saved successfully";
							//prjreturnMessage.timestamp =doc.timestamp;
							 res.jsonp(prjreturnMessage);
						 
				
		 }
		 else{
		 	prjreturnMessage.status=false;
							prjreturnMessage.data={
								totCount:0,
							};
							prjreturnMessage.err=err;
							prjreturnMessage.message ="not saved successfully"+err;
							//prjreturnMessage.timestamp =doc.timestamp;
							 res.jsonp(prjreturnMessage);
						 
		 }
		});

  };
exports.getALLProjects = function(req, res) {
		var accountName = req.body.Account;
		db.projects.find({'Account.selectedResult':accountName},function(err,doc){
			if(doc && doc.length>0){
				prjreturnMessage.status=true;
	        		prjreturnMessage.message ="projects fetched successfully";
				prjreturnMessage.data = doc;
				 res.jsonp(prjreturnMessage);
		 }
else{
					prjreturnMessage.status=false;
	        		prjreturnMessage.message ="No projects found";
					 res.jsonp(prjreturnMessage);
}
		});

  };
exports.getfixdprojct = function(req, res) {
		 var ts= req.params.ts;
		db.projects.find({'prjid':ts},function(err,doc){
			if(doc){
				db.JIRA.find({ $query: {'prjid':ts},$orderby: { timstmp: -1 }},function(err,doc){
					if(doc && doc.length > 0 ){
						tstJIRAobj.tst=tst;
						tstJIRAobj.jir=doc;
						//console.log("stp 0 "+tstJIRAobj)
						//return tstJIRAobj;
						var JIRAS = {
								list : tstJIRAobj.jir,
								currentJIRA:""
							};
					var testCases = tstJIRAobj.tst;
					doc.JIRAS = JIRAS;
					doc.testCases = testCases;
				prjreturnMessage.status=true;
	        		prjreturnMessage.message ="project data fetched successfully";
				prjreturnMessage.data = doc;
				 res.jsonp(prjreturnMessage);
						 }
					else{
							tstJIRAobj.tst=tst;
							tstJIRAobj.jir=[];
							//console.log(tstJIRAobj)
							//return tstJIRAobj;
					}
				});
					
		 }
		else{
							prjreturnMessage.status=false;
							prjreturnMessage.message ="No project found with that id ";
							 res.jsonp(prjreturnMessage);
		}
		});

  };
 exports.getTestselectdPorject = function(req, res) {
		var ts= req.params.ts;
		db.testcases.find({'prjid':ts},function(err,doc){
			if(doc){
			var tst = doc;
			db.JIRA.find({ $query: {'prjid':ts},$orderby: { timstmp: -1 }},function(err,doc){
					if(doc && doc.length > 0 ){
						tstJIRAobj.tst=tst;
						//console.log(doc);
						tstJIRAobj.jir=doc;
						//console.log("stp 0 "+tstJIRAobj)
						//return tstJIRAobj;
						 }
					else{
							tstJIRAobj.tst=tst;
							tstJIRAobj.jir=[];
							//console.log(tstJIRAobj)
							//return tstJIRAobj;
					}
					if(tstJIRAobj.tst.length>0){
						prjreturnMessage.status=true;
						//.message ="projects fetched successfully";
						prjreturnMessage.data = tstJIRAobj;
						res.jsonp(prjreturnMessage);
						}
					else{
						prjreturnMessage.status=false;
						prjreturnMessage.message ="no testcases found";
						prjreturnMessage.data = tstJIRAobj;
						res.jsonp(prjreturnMessage);
						}
				});
				
		 }
		else{
						
							
		}
		});
	
		  };

   
  exports.getrunsbyJIRA = function(req, res) {
		 var zertst= req.params.JIRA.split("_");
		 var zr = zertst[0];
		 var ts = zertst[1];
		 var runid =  zertst[2].split("-").join("/");
		db.runlist.find({'info.JIRANumber':zr,'info.tstCASID':ts,  'runid': { $ne: runid } } ,function(err,doc){
			if(doc){
				prjreturnMessage.status=true;
	        		prjreturnMessage.message ="previous RUNS fetched successfully";
				prjreturnMessage.data = doc;
				 res.jsonp(prjreturnMessage);
		 }
else{
prjreturnMessage.status=false;
	        		prjreturnMessage.message ="No RUNS";
					 res.jsonp(prjreturnMessage);
}
		});

  };
   exports.getrunsCountbyJIRA = function(req, res) {
		 var zertst= req.params.JIRA.split("_");
		 var zr = zertst[0];
		 var ts = zertst[1];
		 db.runlist.count({'info.JIRANumber':zr,'info.tstCASID':ts,'status.selectedResult':'fail'},function(err,failsdoc){
			 
			 //console.log("f"+failsdoc)
			 failsdoc = failsdoc==null ? 0:failsdoc;
				 db.runlist.count({'info.JIRANumber':zr,'info.tstCASID':ts,'status.selectedResult':'Success'},function(err,succsdoc){
						 // console.log("s"+succsdoc)
						  succsdoc = succsdoc==null ? 0:succsdoc;
							db.runlist.count({'info.JIRANumber':zr,'info.tstCASID':ts},function(err,doc){
			if(doc){
				//console.log(doc);
				prjreturnMessage.status=true;
	        		prjreturnMessage.message ="";
				prjreturnMessage.data = {
					succ:succsdoc,
					fails:failsdoc,
					runs:doc+1
				}
				 res.jsonp(prjreturnMessage);
		 }
				else{
									prjreturnMessage.status=false;
									prjreturnMessage.message ="No RUNS";prjreturnMessage.data="";
									 res.jsonp(prjreturnMessage);
				}
		});
					
				 });
			
		 });
		
		

  };
  
  exports.postcritic = function(req){
	//console.log(req)
	delete req['$$hashKey']
	db.posts.update({'postid':req.postid},req,{upsert:true},function(err,doc){ 
		if(doc){
				
									prjreturnMessage.status=true;
									prjreturnMessage.message ="posting your kritik success";prjreturnMessage.data=req;
									//res.jsonp(prjreturnMessage);
									sktio.sockets.emit('message',prjreturnMessage);
		}else{
									prjreturnMessage.status=false;
									prjreturnMessage.message ="posting your kritik fails please retry ..";prjreturnMessage.data="";
									 //res.jsonp(prjreturnMessage);
									 sktio.sockets.emit('message', prjreturnMessage);
		}
	});
  };
    
  exports.delPosts = function(req){
		db.posts.remove({'postid':req},function(err,doc){ 
		if(doc){
									prjreturnMessage.status=true;
									prjreturnMessage.message ="deleting your kritik success";prjreturnMessage.data=req;
									sktio.sockets.emit('delmessage',prjreturnMessage);
		}else{
									prjreturnMessage.status=false;
									prjreturnMessage.message ="deleting your kritik fails please retry ..";prjreturnMessage.data="";
									sktio.sockets.emit('delmessage',prjreturnMessage);
		}
	});
  };
  exports.getALLPosts = function(req, res) {
		db.posts.find({ $query: {},$orderby: { 'info.tstmp': -1 }},function(err,doc){
			if(doc && doc.length>0){
				prjreturnMessage.status=true;
	        		prjreturnMessage.message ="projects fetched successfully";
				prjreturnMessage.data = doc;
				 res.jsonp(prjreturnMessage);
		 }
else{
					prjreturnMessage.status=false;
	        		//prjreturnMessage.message ="No projects found";
					 res.jsonp(prjreturnMessage);
}
		});

  };