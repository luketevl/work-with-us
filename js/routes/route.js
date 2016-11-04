'use strict';

const candidatesCtrl        = require('../controllers/candidatesController')();
const Candidates            = require('../models/candidates')();
const Areas                 = require('../models/areas')();
const path                  = require('path');
const multiparty            = require('connect-multiparty');
const multipartyMiddleware  = multiparty();

// ROUTE for API
module.exports = (app) => {

  const routesCtrl        = require('../controllers/routesController')(app);

  app.get('/uploads/files/:_id/:name', function(req, res) {
    res.sendFile(path.join(`${__dirname}/../../uploads/files/${req.params._id}/${req.params.name}`));
});

  // ROUTE for API
  app.get('/api/v1/candidates', (req, res) => {
    Candidates.find({}, function(err, todos) {
      if (err){
        res.status(500).json(err);
        throw err;
      }
      let new_todos = todos.map(todo => {
        return {
            _id: todo._id,
            name: todo.name,
            checked: todo.checked,
            img: candidatesCtrl.getFile(todo)
        };
      });
      res.status(202).json(new_todos);
    });
    // How we are using JSON the response use the function json

  });

  app.delete('/api/v1/candidates/:_id', (req, res) => {
    Candidates.findByIdAndRemove(req.params._id, function(err) {
      if (err){
        res.status(500).json(err);
        throw err;
      }
      console.log('Candidates deleted');
      res.status(202).json({success: true});

    });
  });

  app.put('/api/v1/candidates/', multipartyMiddleware, (req, res) => {
    let data = req.body;
    let {name, checked, _id} = data;
    let file;
    let result_candidate;
    console.log(req.files);
    if(req.files){
      file = req.files.file;
    }

    Candidates.findByIdAndUpdate(_id, {name, checked}, function(err, todo) {
      if (err){
        res.status(500).json(err);
        throw err;
      }
      if(file){
        let result = candidatesCtrl.upload(file, todo);
        if(result){
          var file_path = result.target_path;
        }
        console.log(result);
      }
      result_candidate = {
        _id : todo._id,
        img: file_path
      };
      console.log('Candidates edited');
      res.status(202).json({success: true, todo: result_candidate});

    });
  });

  // ROUTE to API
  app.post('/api/v1/candidates', multipartyMiddleware,(req, res) => {
    let data = req.body;
    let file;
    let result_candidate;
    if(req.files){
      file = req.files.file;
    }
    let candidates = new Candidates(data);
    candidates.save().then((result, err) =>{
      if(err){
        res.status(500).json(err);
        throw err;
      }
      if(file){
        let result_upload = candidatesCtrl.upload(req, candidates);
        if(result){
          var file_path = result.target_path;
        }
    }
      result_candidate = {
        _id : result._id,
        name: result.name,
        file_path
      };
      res.status(202).json({success: true, candidates: result_candidate});
    });
  });


app.post('/api/v1/areas', (req, res) => {
  let data = req.body;
  let areas = new Areas(data);
  areas.save().then((result, err) =>{
    if(err){
      res.status(500).json(err);
      throw err;
    }
    console.log('Area created');
    res.status(202).json({success: true, areas: result});
  });
});

app.put('/api/v1/areas' , (req, res) => {
  let data = req.body;

  Areas.findByIdAndUpdate(data._id, data.name , (err, areas) => {
    if(err){
      res.status(500).json(err);
      throw err;
    }
    console.log('Area edited');
    res.status(202).json({success: true, areas})
  });
});

app.delete('/api/v1/areas/:_id', (req, res) => {
  Areas.findByIdAndRemove(req.params._id, function(err) {
    if (err){
      res.status(500).json(err);
      throw err;
    }
    console.log('Area deleted');
    res.status(202).json({success: true});

  });
});


app.get('/api/v1/areas', (req, res) => {
  Areas.find({}, function(err, areas) {
    if (err){
      res.status(500).json(err);
      throw err;
    }
    res.status(202).json(areas);
  });
  // How we are using JSON  the response use the function json

});
};
