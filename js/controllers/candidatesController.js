'use strict';
const fs  = require('fs');
const path = __dirname+'/../../uploads/files/';
module.exports = () =>{
  let _upload = (file, condidate)=>{
  // get the temporary location of the file
    if(!file){
      return {target_path: ''};
    }
    let tmp_path = file.path;
    let target_path = `${path}${condidate._id}/${file.name}`;
    // move the file from the temporary location to the intended location
    try {
       fs.lstatSync(path+condidate._id);
       fs.rmdirSync(path+condidate._id);
     } catch(e) {
       try{
         fs.mkdirSync(path+condidate._id, 777);

       }
       catch(e) {
         console.log(e);
       }
     }

    fs.renameSync(tmp_path, target_path);
    return {
      success: true,
      target_path: `http://localhost:595/uploads/files/${condidate._id}/${file.name}`,
    };
  };

  let _delete = (condidate) => {
    try {
      fs.rmdirSync(path+condidate._id);
    } catch(e) {
      console.log(e);
    }
    fs.unlink(path+condidate._id, function() {
        if (err){
          throw err;
        }
        return {
          success: true,
        };
    });
  };

  let _getFile = (condidate) => {
    try{
      let files = fs.readdirSync(path+condidate._id);
      if(files){
        return `http://localhost:595/uploads/files/${condidate._id}/${files[files.length-1]}`;
      }
    }
    catch(e){
      console.log(e);
    }
    return '';
  };
    return{
      upload: _upload,
      delete: _delete,
      getFile: _getFile
    };
};
