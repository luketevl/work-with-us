'use strict';

const candidatesCtrl        = require('../controllers/candidatesController')();
const Candidates            = require('../models/candidates')();
const path                  = require('path');
const multiparty            = require('connect-multiparty');
const multipartyMiddleware  = multiparty();

// ROUTE for API
module.exports = (app) => {

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
      res.status(202).json({sucess: true});

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
      res.status(202).json({sucess: true, todo: result_candidate});

    });
  });

  // ROUTE to API
  app.post('/api/v1/candidates', multipartyMiddleware,(req, res) => {
    let data = req.body;
    let {name, checked, _id} = data;
    let file;
    let result_candidate;
    if(req.files){
      file = req.files.file;
    }
    data = {
      name,
      checked
    }
    let todo = new Candidates(data);
    todo.save().then((result, err) =>{
      if(err){
        res.status(500).json(err);
        throw err;
      }
      if(file){
        let result_upload = candidatesCtrl.upload(req, todo);
        if(result){
          var file_path = result.target_path;
        }
    }
      result_candidate = {
        _id : result._id,
        name: result.name,
        img: file_path
      };
      res.status(202).json({success: true, todo: result_candidate});
    });
  });
};
