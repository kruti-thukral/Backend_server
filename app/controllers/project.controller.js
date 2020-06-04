const db = require("../models");
const db_project = db.project;
const db_floorplan = db.floorplan;
const Op = db.Sequelize.Op;
var path = require('path');
const fs = require('fs')
const sharp = require("sharp");
const upload_dir = 'uploads/'

exports.upload_dir = upload_dir;
// Create a new project
exports.create = (req, res) => {
 // Validate request
 if (!req.body.name) {
  res.status(400).send({
   message: "Content can not be empty!"
  });
  return;
 }


 const project = {
  name: req.body.name,
  description: req.body.description
 };
 console.log(project)
 // Save project in the database
 db_project.create(project)
  .then(data => {
   res.send(data);
  })
  .catch(err => {
   res.status(500).send({
    message: err.message || "Some error occurred while creating the project."
   });
  });
};





// Create a new floorplan for a project
exports.resizeImages = async (req, res, next) => {
 const id = req.params.id;
 
 db_project.findByPk(id)
  .then(async data => {

   req.floorplans = []
   
   await Promise.all(
    req.files.map(async file => {
     console.log(file)
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


     const floorplan = {
      name: original,
      original: filename,
      thumb: thumb_file_name,
      large: large_file_name,
      fk_projectid: data.id
     };
     req.floorplans.push(floorplan);
    })
   );
   next()

  }).catch(err => {
   res.status(500).send({
    message: "Error retrieving project with id=" + id
   });
  });



};


// req.files.forEach(function (item, index) {
//   console.log(item, index);
//   // var filename = item.path
//   var name = path.parse(item.originalname).name
//   var thumb_file_name = item.filename + '_thumb'
//   var thumb_file_path= 'uploads/' + thumb_file_name

//   sharp(item.path).resize(100, 100).toFormat("png").toBuffer(function(err, buffer) {
//     // console.log(err)
//     fs.writeFile(thumb_file_path, buffer, function(e) {

//     });
// });
//   const floorplan = {
//     name:  name,
//     original: item.filename,
//     thumb: thumb_file_name,
//     fk_projectid: data.id
//  };
//  console.log(floorplan)
//  floorplans.push(floorplan)
// //  Save floorplan in the database
// //  db_floorplan.create(floorplan)
// //   .then(data => {
// //    res.send(data);
// //   })
// //   .catch(err => {
// //    res.status(500).send({
// //     message: err.message || "Some error occurred while creating the floorplan."
// //    });
// //   });
// // });
// //  console.log(req.file)
// //  console.log(req.body)

// })


// Retrieve all projects from the database.
exports.findAll = (req, res) => {
 db_project.findAll({
   include: [db_floorplan]
  })
  .then(data => {
   res.send(data);
  })
  .catch(err => {
   res.status(500).send({
    message: err.message || "Some error occurred while retrieving projects."
   });
  });
};

// Find a single project with an id
exports.findOne = (req, res) => {
 const id = req.params.id;

 db_project.findByPk(id, {
   include: [db_floorplan]
  })
  .then(data => {
    if (data === null) {
      res.send({
        message: `Cannot find project with id=${id}`
      });
    } else {
      res.send(data)
    }
  })
  .catch(err => {
   res.status(500).send({
    message: "Error retrieving project with id=" + id
   });
  });
};

// Update a project by the id in the request
exports.update = (req, res) => {
 const id = req.params.id;
 // update project
 const project = {
  name: req.body.name,
  description: req.body.description
 };
 db_project.update(project, {
   where: {
    id: id
   }
  })
  .then(num => {
   if (num == 1) {
    res.send({
     message: "project was updated successfully."
    });
   } else {
    res.send({
     message: `Cannot update project with id=${id}. Maybe project was not found or body is empty!`
    });
   }
  })
  .catch(err => {
   res.status(500).send({
    message: "Error updating project with id=" + id
   });
  });
};

// Delete a project with the specified id in the request
exports.delete = (req, res) => {
 const id = req.params.id;

 db_project.destroy({
   where: {
    id: id
   }
  })
  .then(num => {
   if (num == 1) {
    res.send({
     message: "project was deleted successfully!"
    });
   } else {
    res.send({
     message: `Cannot delete project with id=${id}. Maybe project was not found!`
    });
   }
  })
  .catch(err => {
   res.status(500).send({
    message: "Could not delete project with id=" + id
   });
  });
};

// Delete all projects from the database.
exports.deleteAll = (req, res) => {
 db_project.destroy({
   where: {},
   truncate: false
  })
  .then(nums => {
   res.send({
    message: `${nums} projects were deleted successfully!`
   });
  })
  .catch(err => {
   res.status(500).send({
    message: err.message || "Some error occurred while removing all projects."
   });
  });
};