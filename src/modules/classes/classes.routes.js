import express from 'express';
const router = express.Router();
import { createClass, getAllClasses, getClassById, updateClass, deleteClass, getClassesByTutorAndInstitute, getStudentClassesByInstituteController, getStudentClassesByTutorController, getAllInstituteClasses, getAllTutorClasses } from './classes.controller.js';

router.post('/create', createClass);
router.get('/', getAllClasses);
router.get('/institute/:id', getAllInstituteClasses);
router.get('/tutor/:tutorId', getAllTutorClasses);

router.get('/:id', getClassById);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

router.get("/tutor/:tutorId/institute/:instituteId", getClassesByTutorAndInstitute);
router.get("/students/:studentId/institute/:instituteId", getStudentClassesByInstituteController);
router.get("/students/:studentId/tutor/:tutorId", getStudentClassesByTutorController);

export default router;

 