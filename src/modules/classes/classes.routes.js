import express from 'express';
const router = express.Router();
import { createClass, getAllClasses, getClassById, updateClass, deleteClass } from './classes.controller.js';

router.post('/', createClass);
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);


export default router;



 