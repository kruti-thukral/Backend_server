module.exports = app => {
    const project_controller = require("../controllers/project.controller.js");
    const floorplan_controller = require("../controllers/floorplan.controller.js");

    var multer  = require('multer')
    var upload = multer({ dest: 'uploads/' }) 
    var router = require("express").Router();
  
    // Create a new project
    router.post("/", project_controller.create);
  
     // Create a new floor plan for a project
    router.post("/:id/floorplans",upload.array('photo'), project_controller.resizeImages ,floorplan_controller.save);

    // Retrieve all projects
    router.get("/", project_controller.findAll);
  
    // Retrieve a single project with id
    router.get("/:id", project_controller.findOne);
  
    // Update a project with id
    router.patch("/:id", project_controller.update);
  
    // Delete a project with id
    router.delete("/:id", project_controller.delete);
  
    // Delete all projects
    router.delete("/", project_controller.deleteAll);
  
    app.use('/api/projects', router);
  };