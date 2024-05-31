import { Router } from "express";
import { z } from "zod";
import { catchErrors } from "./errors";
import { prisma } from "./db";
import { send } from "./response";

const sellersRoute = Router();
const idParamsSchema = z.object({ id: z.coerce.number() });
const nameParamsSchema = z.object({ name: z.coerce.string() });

const sellersBodySchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
});

const partialSellersBodySchema = sellersBodySchema.partial();

sellersRoute.get(
  "/",
  catchErrors(async (req, res) => {
    const totalSellers = await prisma.seller.count();
    const sellers = await prisma.seller.findMany({
      orderBy: { id: "asc" },
      select: {
        name: true,
        email: true,
      },
    });
    send(res).ok({
      msg: `Total sellers: ${totalSellers}`,
      sellers,
    });
  })
);

sellersRoute.get(
  "/?id=:id",
  catchErrors(async (req, res) => {
    const { id: sellerId } = idParamsSchema.parse(req.params);
    if (sellerId !== undefined) {
      const seller = await prisma.seller.findUniqueOrThrow({
        where: { id: sellerId },
      });
      send(res).ok({ seller });
    } else {
      return send(res).notFound();
    }
  })
);

sellersRoute.get(
  "/?name=:name",
  catchErrors(async (req, res) => {
    const { name: sellerName } = nameParamsSchema.parse(req.params);
    if (sellerName !== undefined) {
      console.log(`Searching for seller with name: ${sellerName}`);
      const seller = await prisma.seller.findMany({
        where: {
          name: {
            contains: sellerName,
          },
        },
        orderBy: { name: "asc" },
      });
      send(res).ok({ seller });
    } else {
      return send(res).notFound();
    }
  })
);

sellersRoute.post(
  "/",
  catchErrors(async (req, res) => {
    const data = sellersBodySchema.parse(req.body);
    const seller = await prisma.seller.create({ data });
    send(res).createdOk({
      msg: `Id from new seller: ${seller.id}`,
      seller,
    });
  })
);

sellersRoute.put(
  "/:id",
  catchErrors(async (req, res) => {
    const { id: sellerId } = idParamsSchema.parse(req.params);
    const bodyCheck = partialSellersBodySchema.parse(req.body);

    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: bodyCheck,
    });

    send(res).ok(updatedSeller);
  })
);

sellersRoute.delete(
  "/:id",
  catchErrors(async (req, res) => {
    const { id: sellerId } = idParamsSchema.parse(req.params);
    const seller = await prisma.seller.delete({
      where: { id: sellerId },
    });
    send(res).ok({ msg: `Seller deleted with ID: ${sellerId}` });
  })
);

export default sellersRoute;
