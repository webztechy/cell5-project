import { Router } from 'express';
import AttributesRouter from './attributes/AttributesRouter';
import ProductsRouter from './products/ProductsRouter';
import BrandsRouter from './brands/BrandsRouter';
import UsersRouter from './users/UsersRouter';
import LoginRouter from './users/LoginRouter';


class MasterRouter {
  private _router = Router();
  private _productsRouter = ProductsRouter;
  private _attributesRouter = AttributesRouter;
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
    this._router.use('/attributes', this._attributesRouter);
    this._router.use('/brands', this._brandsRouter);
    this._router.use('/users', this._usersRouter);
    this._router.use('/login', this._loginRouter);
  }
}

export = new MasterRouter().router;