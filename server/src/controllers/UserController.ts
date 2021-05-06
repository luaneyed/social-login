import { Context } from 'koa';
import Router from 'koa-router';

import { UserService } from '../services/UserService';
import { checkAuth } from '../utils/middleware';

export default {
  get router() {
    return new Router()
      .use(checkAuth)
      .get('/', this.list)
      // .get('/:id(\\d+)', this.detail)
      // .delete('/:id(\\d+)', this.delete);
  },
  async list(ctx: Context) {
    ctx.body = await UserService.getUsersPublic();
  },
  async detail(ctx: Context) {
    ctx.body = await UserService.getUser(Number(ctx.params.id));
  },
  async delete({ params: { id }}: Context) {
    await UserService.deleteUser(Number(id));
  },
};
