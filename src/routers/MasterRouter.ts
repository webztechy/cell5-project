import { Router } from 'express';
import OrdersRouter from './orders/OrdersRouter';
import ProductsRouter from './products/ProductsRouter';
import BrandsRouter from './brands/BrandsRouter';
import UsersRouter from './users/UsersRouter';
import LoginRouter from './users/LoginRouter';


class MasterRouter {
  private _router = Router();
  private _productsRouter = ProductsRouter;
  private _ordersRouter = OrdersRouter;
  private _brandsRouter = BrandsRouter;
  private _usersRouter = UsersRouter;
  private _loginRouter = LoginRouter;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.use('/products', this._productsRouter);
    this._router.use('/orders', this._ordersRouter);
    this._router.use('/brands', this._brandsRouter);
    this._router.use('/users', this._usersRouter);
    this._router.use('/login', this._loginRouter);
  }
}

export = new MasterRouter().router;