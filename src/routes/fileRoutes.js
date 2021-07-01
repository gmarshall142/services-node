import { Router } from 'express';
import FileController from '../controllers/fileController';

const fileRoutes = Router();
const controller = new FileController();

fileRoutes.post('/upload', controller.uploadFiles);
// fileRoutes.get('/temp/:fileName', controller.downloadTempFile);
// fileRoutes.delete('/temp/:fileName', controller.deleteTempFile);
// fileRoutes.get('/temp', controller.getUserAttachments);
//
fileRoutes.get('/:appId/:fileName', controller.downloadFile);

export default fileRoutes;

