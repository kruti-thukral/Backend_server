module.exports = app => {
    const floorplan_controller = require("../controllers/floorplan.controller.js");
    var multer  = require('multer')
    var upload = multer({ dest: 'uploads/' }) 
    var router = require("express").Router();
  
    // Retrieve all floorplans
    router.get("/", floorplan_controller.findAll);
  
    // Retrieve a floorplan by id
    router.get("/:id", floorplan_controller.findOne);
  
    // Update a floorplan by id
    router.patch("/:id", upload.single('photo'), floorplan_controller.updateImage ,floorplan_controller.update);
  
    // Delete a floorplan by id
    router.delete("/:id", floorplan_controller.delete);
  
    // delete all floorplans
    router.delete("/", floorplan_controller.deleteAll);

    // Get image content
    router.get("/image/:id",floorplan_controller.getImage);
  
    app.use('/api/floorplans', router);
  };