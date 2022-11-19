// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();

  const date = req.body.date;
  const token = req.body.refreshToken;

  try {
    const schedule = await prisma.schedule.findFirst({
      where: {
        date: date,
      },

      include: {
        availableTimes: true,
      },
    });

    if (schedule === null) {
      jwt.verify(
        token,
        process.env.JWT_SECRET!,
        async (err: any, decoded: any) => {
          if (err) {
            return res.status(401).json({ status: "Unauthorized" });
          }

          if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ status: "Unauthorized" });
          }

          const schedule = await prisma.schedule.create({
            data: {
              date: date,
              // times: times,
              users: {
                connect: {
                  id: decoded.id,
                },
              },
            },

            include: {
              availableTimes: true,
            },
          });

          return res.status(200).json({ status: "OK", schedule });
        }
      );
    } else {
      return res.status(200).json({ status: "OK", schedule });
    }
  } catch (error) {
    return res.status(500).json({ status: error });
  }
}
