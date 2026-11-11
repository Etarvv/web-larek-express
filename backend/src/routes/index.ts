import {
  NextFunction, Request, Response, Router,
} from 'express';
import productRouter from './product';
import orderRouter from './order';
import { NotFoundError } from '../errors';

const router = Router();

router.use('/product', productRouter);
router.use('/order', orderRouter);
router.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
