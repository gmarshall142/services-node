import { Router } from 'express';
import controller from '../controllers/masterController';

const masterRoutes = Router();

masterRoutes.get('/tags', controller.tagsFindAll);

export default masterRoutes;
