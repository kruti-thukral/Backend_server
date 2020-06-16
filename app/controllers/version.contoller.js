const db = require("../models");
const db_floorplan = db.floorplan;
const Op = db.Sequelize.Op;
const project_controller = require("./project.controller.js");




// Save  version 
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

 