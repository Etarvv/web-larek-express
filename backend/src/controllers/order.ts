import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import { BadRequestError } from '../errors';

interface IOrderBody {
  items: string[];
  total: number;
}

const createOrder = async (
  req: Request<unknown, unknown, IOrderBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, total } = req.body;

    const uniqueIds = [...new Set(items)];
    const products = await Product.find({ _id: { $in: uniqueIds } });

    if (products.length !== uniqueIds.length) {
      return next(new BadRequestError('Один или несколько товаров не найдены'));
    }

    const prices = new Map<string, number | null>(
      products.map((product) => [String(product._id), product.price]),
    );

    let sum = 0;
    for (let i = 0; i < items.length; i += 1) {
      const price = prices.get(items[i]);
      if (price === null || price === undefined) {
        return next(new BadRequestError('Один или несколько товаров не продаются'));
      }
      sum += price;
    }

    if (sum !== total) {
      return next(new BadRequestError('Сумма заказа не совпадает со стоимостью товаров'));
    }

    return res.status(201).send({ id: faker.string.uuid(), total });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
