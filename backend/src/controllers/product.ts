import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError, mongo } from 'mongoose';
import Product, { IProduct } from '../models/product';
import { BadRequestError, ConflictError } from '../errors';

const DUPLICATE_KEY_CODE = 11000;

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Product.find({}).select('-__v');
    return res.send({ items, total: items.length });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: Request<unknown, unknown, IProduct>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title, image, category, description, price,
    } = req.body;
    const product = await Product.create({
      title, image, category, description, price,
    });
    return res.status(201).send(product);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof mongo.MongoServerError && error.code === DUPLICATE_KEY_CODE) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }
    return next(error);
  }
};
