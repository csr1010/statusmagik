db.runlist.count({'info.JIRANumber':'111111d','status.selectedResult':'fail'})
db.runlist.count({'info.JIRANumber':'121216','status.selectedResult':'Success'})

db.JIRA.find(
{'prjid':"1407008503549PR111111"}
).sort( { timstmp: -1 } );

db.JIRA.find({ $query: {'prjid':"1407008503549PR111111"},$orderby: { timstmp: -1 }})
db.JIRA.ensureIndex({"timstmp":-1},{unique:true});
_
db.runlist.count({'info.JIRANumber':'111111d','info.tstCASID':'1407008510404TSC111111','status.selectedResult':'fail'})
db.runlist.count({'info.JIRANumber':zr,'info.tstCASID':ts,'status.selectedResult':'Success'})

db.users.remove()

db.projects.remove()
db.runlist.remove()
db.JIRA.remove()
db.testcases.remove()
db.posts.remove()
db.posts.ensureIndex({"info.tstmp":1},{unique:true});






