import { Router } from "express";
import { z } from "zod";
import { catchErrors } from "./errors";
import { prisma } from "./db";
import { send } from "./response";

const productsRouter = Router();
const idParamsSchema = z.object({ id: z.coerce.number() });

const productsBodySchema = z.object({
  name: z.string().min(3).max(50),
  price: z.number(),
  description: z.string().min(15).max(255),
  color: z.string().min(3).max(25),
});

productsRouter.get(
  "/",
  catchErrors(async (req, res) => {
    const totalProducts = await prisma.product.count();
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });
    send(res).ok({
      msg: `Total products: ${totalProducts}`,
      products,
    });
  })
);

export default productsRouter;
