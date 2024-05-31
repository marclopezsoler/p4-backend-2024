import { Router } from "express";
import { z } from "zod";
import { catchErrors } from "./errors";
import { prisma } from "./db";
import { send } from "./response";

const clientsRouter = Router();
const idParamsSchema = z.object({ id: z.coerce.number() });
const nameParamsSchema = z.object({ name: z.coerce.string() });

const clientsBodySchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
});

const partialClientsBodySchema = clientsBodySchema.partial();

clientsRouter.get(
  "/",
  catchErrors(async (req, res) => {
    const totalclients = await prisma.client.count();
    const clients = await prisma.client.findMany({
      orderBy: { id: "asc" },
      select: {
        name: true,
        email: true,
      },
    });
    send(res).ok({
      msg: `Total clients: ${totalclients}`,
      clients,
    });
  })
);

clientsRouter.get(
  "/?id=:id",
  catchErrors(async (req, res) => {
    const { id: clientId } = idParamsSchema.parse(req.params);
    if (clientId !== undefined) {
      const client = await prisma.client.findUniqueOrThrow({
        where: { id: clientId },
      });
      send(res).ok({ client });
    } else {
      return send(res).notFound();
    }
  })
);

clientsRouter.get(
  "/?name=:name",
  catchErrors(async (req, res) => {
    const { name: clientName } = nameParamsSchema.parse(req.params);
    if (clientName !== undefined) {
      const client = await prisma.client.findMany({
        where: {
          name: {
            contains: clientName,
          },
        },
        orderBy: { name: "asc" },
      });
      send(res).ok({ client });
    } else {
      return send(res).notFound();
    }
  })
);

clientsRouter.post(
  "/",
  catchErrors(async (req, res) => {
    const data = clientsBodySchema.parse(req.body);
    const client = await prisma.client.create({ data });
    send(res).createdOk({
      msg: `Id from new client: ${client.id}`,
      client,
    });
  })
);

clientsRouter.put(
  "/:id",
  catchErrors(async (req, res) => {
    const { id: clientId } = idParamsSchema.parse(req.params);
    const bodyCheck = partialClientsBodySchema.parse(req.body);

    const updatedclient = await prisma.client.update({
      where: { id: clientId },
      data: bodyCheck,
    });

    send(res).ok(updatedclient);
  })
);

clientsRouter.delete(
  "/:id",
  catchErrors(async (req, res) => {
    const { id: clientId } = idParamsSchema.parse(req.params);
    const client = await prisma.client.delete({
      where: { id: clientId },
    });
    send(res).ok({ msg: `Client deleted with ID: ${clientId}.` });
  })
);

export default clientsRouter;
