import { Request, Response } from "express";
import {
  GenericCommand,
  GenericContext,
  GenericTrigger,
  UniCord,
} from "./generic_handler";

export enum ExpressMethodType {
  POST = "POST",
  GET = "GET",
}

export class ExpressCommandTrigger extends GenericTrigger {
  method: ExpressMethodType;
  route: string = "/commands/test";
  register(unicord: UniCord, event: GenericCommand): void {
    if (this.method == ExpressMethodType.POST) {
      unicord.express_client.post(this.route, (req: Request, res: Response) =>
        this.execute(unicord, event, req, res)
      );
    } else {
      unicord.express_client.get(this.route, (req: Request, res: Response) =>
        this.execute(unicord, event, req, res)
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to_ctx: (unicord: UniCord, ...args: any[]) => Promise<GenericContext>;
  from_ctx: (ctx: GenericContext) => Promise<void>;
  get_name = () => {
    return undefined;
  };

  constructor(
    method: ExpressMethodType,
    route: string,
    to_ctx: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((unicord: UniCord, ...args: any[]) => Promise<GenericContext>)
      | undefined = undefined,
    from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined = undefined
  ) {
    super();

    this.method = method;
    this.route = route;
    this.to_ctx = to_ctx || default_to_ctx;
    this.from_ctx = from_ctx || default_from_ctx;
  }
}

const default_to_ctx = async (
  unicord: UniCord,
  req: Request,
  res: Response
) => {
  const ctx = new GenericContext();

  ctx.unicord = unicord;
  ctx.req = req;
  ctx.res = res;

  return ctx;
};

const default_from_ctx = async (ctx: GenericContext) => {
  ctx.res.json({
    results: ctx.results,
  });
};
