import { Router } from 'express';
import controller from '../controllers/menuController';
import authController from '../controllers/authController';

const menuRoutes = Router();

menuRoutes.get('/', authController.setJwtUser, authController.getPermissions, controller.menuFindAll);
// menuRoutes.get('/', controller.menuFindAll);
menuRoutes.post('/', controller.menuAdd);
menuRoutes.post('/bulk', controller.menuBulkAdd);
menuRoutes.put('/bulk', controller.menuBulkUpdate);
menuRoutes.delete('/bulk', controller.menuBulkDelete);

export default menuRoutes;
