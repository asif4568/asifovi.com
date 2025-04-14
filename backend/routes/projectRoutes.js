const express = require('express');
const router = express.Router();
const { 
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// Get all projects
router.get('/', getProjects);

// Get single project
router.get('/:id', getProject);

// Create new project (would be protected in production)
router.post('/', createProject);

// Update project (would be protected in production)
router.put('/:id', updateProject);

// Delete project (would be protected in production)
router.delete('/:id', deleteProject);

module.exports = router; 