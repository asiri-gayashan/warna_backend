import express from 'express';
const router = express.Router();
import { createClass, getAllClasses, getClassById, updateClass, deleteClass , getClassesByTutorAndInstitute} from './classes.controller.js';

router.post('/create', createClass);
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

router.get("/tutor/:tutorId/institute/:instituteId", getClassesByTutorAndInstitute);
export default router;



   