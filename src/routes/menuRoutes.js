import { Router } from 'express';
import controller from '../controllers/menuController';

const menuRoutes = Router();

menuRoutes.get('/', controller.menuFindAll);
menuRoutes.post('/', controller.menuAdd);
menuRoutes.post('/bulk', controller.menuBulkAdd);
menuRoutes.put('/bulk', controller.menuBulkUpdate);
menuRoutes.delete('/bulk', controller.menuBulkDelete);

export default menuRoutes;
