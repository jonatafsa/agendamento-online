// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();

  const sheduleID = req.body.sheduleID;
  const token = req.body.refreshToken;
  const time = req.body.time;

  try {
    const avaliableTimes = await prisma.avaliableTimes.findFirst({
      where: {
        time: time,
        scheduleId: {
          equals: sheduleID,
        },
      },
    });

    console.log(avaliableTimes);

    if (avaliableTimes) {
      return res
        .status(409)
        .json({ message: "Avaliable times already exists", error: 409 });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET!,
      async (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({ status: "Unauthorized" });
        }

        const { id, exp } = decoded;

        if (exp < Date.now() / 1000) {
          return res.status(401).json({ status: "Unauthorized" });
        }

        const avaliableTime = await prisma.avaliableTimes.create({
          data: {
            time: time,
            // scheduleId: sheduleID,
            // available: true,

            schedule: {
              connect: {
                id: sheduleID,
              },
            },
          },
        });

        return res.status(200).json({ status: "OK", avaliableTime });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
