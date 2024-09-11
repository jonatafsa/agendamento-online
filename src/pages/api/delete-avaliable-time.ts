// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();

  const hourId = req.body.hourId;
  const token = req.body.refreshToken;

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET!,
      async (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({ status: "Unauthorized" });
        }

        const { exp } = decoded;

        if (exp < Date.now() / 1000) {
          return res.status(401).json({ status: "Unauthorized" });
        }

        const avaliableTimes = await prisma.avaliableTimes.delete({
          where: {
            id: hourId,
          },
        });

        console.log(avaliableTimes);

        return res
          .status(200)
          .json({ status: "OK", message: "Excluido com sucesso" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
