const db = require("../models");
const db_floorplan = db.floorplan;
const Op = db.Sequelize.Op;
const project_controller = require("./project.controller.js");
const fs = require('fs')
var path = require('path');
const sharp = require("sharp");
const upload_dir = 'uploads/'

// Retrieve all db_floorplans from the database.
exports.findAll = (req, res) => {
    db_floorplan.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving floorplans."
        });
      });
};

// Find a single floorplan with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    db_floorplan.findOne({
      where: { id: id }
    })
      .then(data => {
        if (data === null) {
          res.send({
            message: `Cannot find floorplan with id=${id}`
          });
        } else {
          res.send(data)
        }
       
      }).catch(err => {
        console.log("Not found")
        res.status(500).send({
          message: "Error retrieving floorplan with id=" + id
        });
      });
};

// Update a floorplan by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    db_floorplan.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "floorplan was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update floorplan with id=${id}. Maybe floorplan was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating floorplan with id=" + id
        });
      });
};

// Delete a floorplan with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    db_floorplan.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "floorplan was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete floorplan with id=${id}. Maybe floorplan was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete floorplan with id=" + id
        });
      });
};

// Delete all floorplans from the database.
exports.deleteAll = (req, res) => {
    db_floorplan.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} floorplans were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all floorplans."
          });
        });
};

// Save  floorplan 
exports.save = (req, res) => {
  var promises = req.floorplans.map(function(floorplan) {
   return db_floorplan.create(floorplan);
  });
  Promise.all(promises).then(function() {
   res.send({
    "message": "Successfully created floorplans"
   })
  }).catch(err => {
   res.status(500).send({
    "message": "Error while saving floorplans"
   });
  });
 }

 // send image content 
 exports.getImage = (req, res) => {
   //read the image using fs and send the image content back in the response
   const filename = req.params.id

        fs.readFile(project_controller.upload_dir + filename, function (err, content) {
          if (err) {
              // res.writeHead(400, {'Content-type':'text/html'})
              console.log(err);
              res.status(400).send({"message": "No such image"});    
          } else {
              //specify the content type in the response will be an image
              res.writeHead(200,{'Content-type':'image/jpg'});
              res.end(content);
          }
      })
 }

 // Create a new floorplan for a project
exports.updateImage = async (req, res, next) => {
      console.log(req.file)
      if (req.file !== undefined) {

      
      var file = req.file
      var filename = file.filename
      var original = path.parse(file.originalname).name
      var thumb_file_name = filename + '_thumb'
      var thumb_file_path = upload_dir + thumb_file_name
 
      var large_file_name = filename + '_large'
      var large_file_path = upload_dir + large_file_name
 
 
      await sharp(file.path)
       .resize(100, 100)
       .toFormat("png")
       .toFile(thumb_file_path);
 
      await sharp(file.path)
       .resize(2000, 2000)
       .toFormat("png")
       .toFile(large_file_path);

      req.body.name = req.body.name || original;
      req.body.original = filename,
      req.body.original = thumb_file_name,
      req.body.original = large_file_name
    }
    
    
    next()
 
   
 
 
 
 };

