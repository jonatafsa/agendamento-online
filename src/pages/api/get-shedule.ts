// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();

  const user: any = req.query.user;

  const schedules = await prisma.users.findUnique({
    where: {
      username: user,
    },

    select: {
      name: true,
      job: true,
      jobTime: true,
      price: true,
      schedules: {
        include: {
          availableTimes: true,
        },
      },
    },

    // include: {
    //   schedules: {
    //     include: {
    //       availableTimes: true,
    //     },
    //   },
    // },
  });

  console.log("user: ", schedules);

  return res.json({ schedules });

  // try {
  //   const schedule = await prisma.schedule.findFirst({
  //     where: {
  //       date: date,
  //     },

  //     include: {
  //       availableTimes: true,
  //     },
  //   });

  //   if (schedule === null) {
  //     jwt.verify(
  //       token,
  //       process.env.JWT_SECRET!,
  //       async (err: any, decoded: any) => {
  //         if (err) {
  //           return res.status(401).json({ status: "Unauthorized" });
  //         }

  //         if (decoded.exp < Date.now() / 1000) {
  //           return res.status(401).json({ status: "Unauthorized" });
  //         }

  //         const schedule = await prisma.schedule.create({
  //           data: {
  //             date: date,
  //             // times: times,
  //             users: {
  //               connect: {
  //                 id: decoded.id,
  //               },
  //             },
  //           },

  //           include: {
  //             availableTimes: true,
  //           },
  //         });

  //         return res.status(200).json({ status: "OK", schedule });
  //       }
  //     );
  //   } else {
  //     return res.status(200).json({ status: "OK", schedule });
  //   }
  // } catch (error) {
  //   return res.status(500).json({ status: error });
  // }
}
