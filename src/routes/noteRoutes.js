import { Router } from 'express';
import controller from '../controllers/noteController';

const noteRoutes = Router();

/**
 * GET home page
 */
// quoteRoutes.get('/', (req, res) => {
//   res.render('index', { title: 'Express Babel' });
// });

noteRoutes.get('/topics/', controller.noteTopicsFindAll);
noteRoutes.get('/topics/:topicId', controller.noteTopicsFind);
noteRoutes.post('/topics/', controller.noteTopicsAdd);

noteRoutes.get('/', controller.notesFindAll);
noteRoutes.get('/:noteId', controller.notesFind);
noteRoutes.post('/', controller.notesAdd);
noteRoutes.put('/:noteId', controller.notesUpdate);
noteRoutes.delete('/:noteId', controller.notesDelete);
//
// quoteRoutes.post('/', controller.quoteAdd);
// quoteRoutes.get('/:quoteId', controller.quoteFind);
// quoteRoutes.put('/:quoteId', controller.quoteUpdate);
// quoteRoutes.delete('/:quoteId', controller.quoteDelete);

export default noteRoutes;
