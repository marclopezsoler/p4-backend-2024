import { Router } from "express";
import { z } from "zod";
import { catchErrors } from "./errors";
import { prisma } from "./db";
import { send } from "./response";

const ordersRouter = Router();
const idParamsSchema = z.object({ id: z.coerce.number() });
const statusParamsSchema = z.object({ status: z.coerce.string() });

const ordersBodySchema = z.object({
  clientId: z.number(),
  sellerId: z.number(),
  productId: z.number(),
  status: z.string(),
});

const partialOrdersBodySchema = ordersBodySchema.partial();

ordersRouter.get(
  "/",
  catchErrors(async (req, res) => {
    const totalOrders = await prisma.order.count();
    const orders = await prisma.order.findMany({
      orderBy: { id: "asc" },
    });
    send(res).ok({
      msg: `Total orders: ${totalOrders}`,
      orders,
    });
  })
);

ordersRouter.get(
  "/?id=:id",
  catchErrors(async (req, res) => {
    const { id: orderId } = idParamsSchema.parse(req.params);
    if (orderId !== undefined) {
      const order = await prisma.order.findUniqueOrThrow({
        where: { id: orderId },
      });
      send(res).ok({ order });
    } else {
      return send(res).notFound();
    }
  })
);

ordersRouter.get(
  "/?client=:id",
  catchErrors(async (req, res) => {
    const { id: clientIdEntered } = idParamsSchema.parse(req.params);
    if (clientIdEntered !== undefined) {
      const order = await prisma.order.findMany({
        where: { clientId: clientIdEntered },
        orderBy: { id: "asc" },
      });
      send(res).ok({ order });
    } else {
      return send(res).notFound();
    }
  })
);

ordersRouter.get(
  "/?product=:id",
  catchErrors(async (req, res) => {
    const { id: productIdEntered } = idParamsSchema.parse(req.params);
    if (productIdEntered !== undefined) {
      const order = await prisma.order.findMany({
        where: { productId: productIdEntered },
        orderBy: { id: "asc" },
      });
      send(res).ok({ order });
    } else {
      return send(res).notFound();
    }
  })
);

ordersRouter.get(
  "/?seller=:id",
  catchErrors(async (req, res) => {
    const { id: sellerIdEntered } = idParamsSchema.parse(req.params);
    if (sellerIdEntered !== undefined) {
      const order = await prisma.order.findMany({
        where: { sellerId: sellerIdEntered },
        orderBy: { id: "asc" },
      });
      send(res).ok({ order });
    } else {
      return send(res).notFound();
    }
  })
);

ordersRouter.get(
  "/?status=:status",
  catchErrors(async (req, res) => {
    const { status: statusEntered } = statusParamsSchema.parse(req.params);
    if (statusEntered !== undefined) {
      const order = await prisma.order.findMany({
        where: {
          status: {
            contains: statusEntered,
          },
        },
        orderBy: { id: "asc" },
      });
      send(res).ok({ order });
    } else {
      return send(res).notFound();
    }
  })
);

ordersRouter.post(
  "/",
  catchErrors(async (req, res) => {
    const data = ordersBodySchema.parse(req.body);
    const order = await prisma.order.create({ data });
    send(res).createdOk({
      msg: `New order ID: ${order.id}`,
      order,
    });
  })
);

ordersRouter.put(
  "/:id",
  catchErrors(async (req, res) => {
    const { id: orderId } = idParamsSchema.parse(req.params);
    const bodyCheck = partialOrdersBodySchema.parse(req.body);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: bodyCheck,
    });

    send(res).ok(updatedOrder);
  })
);

ordersRouter.delete(
  "/:id",
  catchErrors(async (req, res) => {
    const { id: orderId } = idParamsSchema.parse(req.params);
    const order = await prisma.order.delete({
      where: { id: orderId },
    });
    send(res).ok({ msg: `Order deleted: ${orderId}` });
  })
);

export default ordersRouter;
