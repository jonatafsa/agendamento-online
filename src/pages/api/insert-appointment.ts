// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Process a POST request
  if (req.method === "POST") {
    const prisma = new PrismaClient();

    const { name, phone, email, memo, id } = req.body;

    try {
      const newAppointment = await prisma.avaliableTimes.update({
        where: {
          id,
        },

        data: {
          available: false,
          scheduleDetails: {
            create: {
              clientName: name,
              clientMail: email,
              clientTel: phone,
              clientMemo: memo,
            },
          },
        },
      });

      // const newAppointmentINSCHEDULE = await prisma.scheduleDetails.create({
      //   data: {
      //     clientName: "Jonata Santos",
      //     clientMail: "jonata.js@mail.com",
      //     clientTel: "11999999999",
      //     clientMemo: "Teste",

      //     avaliableTimes: {
      //       connect: {
      //         id: "clancyeig00160zno0wddhse4",
      //       },
      //     },
      //   },
      // });

      console.log(newAppointment);

      res.status(201).json({ message: "Agendado!!", newAppointment });
    } catch (error: any) {
      console.log(error);

      if (error.code === "P2002") {
        return res
          .status(401)
          .json({ message: "Horário já não está mais disponível", code: 401 });
      }

      return res.status(500).json({ message: "Error", error });
    }
  }

  // Process a GET request
  if (req.method === "GET") {
    return res.json({
      message: "Essa é minha humilde rota GET, não tem nada pra você aqui!",
    });
  }
}
