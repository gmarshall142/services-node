import { Router } from 'express';
import controller from '../controllers/quoteController';

const quoteRoutes = Router();

/**
 * GET home page
 */
// quoteRoutes.get('/', (req, res) => {
//   res.render('index', { title: 'Express Babel' });
// });

quoteRoutes.get('/', controller.quoteFindAll);
quoteRoutes.post('/', controller.quoteAdd);
quoteRoutes.get('/:quoteId', controller.quoteFind);
quoteRoutes.put('/:quoteId', controller.quoteUpdate);
quoteRoutes.delete('/:quoteId', controller.quoteDelete);

export default quoteRoutes;
