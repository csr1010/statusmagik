
module.exports = function(app) {
    //Client Routes
    var clients = require('../api/login');
	 var projectcreation = require('../api/projectdetails');
	//var questions = require('../api/questions');
	


/*    app.get('/exams', exams.findallexams);
	app.get('/questions/:examid', questions.findallquestions);
	app.get('/attempts/:empid', questions.getattempts);
	app.post('/setattempts', questions.setattempts);
	app.post('/questions', questions.saveallquestions);*/
	
	 app.post('/saveProjectdetails', projectcreation.createProject);
	 app.post('/saveRundetails', projectcreation.createrun);
	 app.post('/fetchProjects', projectcreation.getALLProjects);
	  app.get('/fetchPosts', projectcreation.getALLPosts);
	   //app.get('/delPosts/:ts', projectcreation.delPosts);
	
	app.get('/fetchSelectdProjct/:ts', projectcreation.getfixdprojct);
	app.get('/fetchtestandjiras/:ts', projectcreation.getTestselectdPorject);
	app.get('/fetchSelectdRUNJIRA/:JIRA', projectcreation.getrunsbyJIRA);
	app.get('/fetchSelectdRUNJIRACount/:JIRA', projectcreation.getrunsCountbyJIRA);

	 
    app.post('/register', clients.create);
    app.get('/users/:account', clients.findallusers);
    app.post('/registerAdmin', clients.createAdmin);
    app.post('/signIn', clients.findbyID);
    app.get('/currency/:account', clients.getcurrencyCodes);
    //app.put('/clients/:clientId', clients.update);
    //app.del('/clients/:clientId', clients.destroy);

    //Finish with setting up the clientId param
   // app.param('clientId', clients.client);
};
