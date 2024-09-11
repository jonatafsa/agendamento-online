// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    const prisma = new PrismaClient();

    try {
      const newUSer = await prisma.users.create({
        data: {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          job: req.body.job,
          password: req.body.password,
          jobTime: "0",
          price: 0,
        },
      });

      const token = await createToken(newUSer);
      res.status(201).json({ message: "User created", user: newUSer, token });
    } catch (error: any) {
      console.log(error);

      if (error.code === "P2002") {
        return res
          .status(401)
          .json({ message: "User already exists", target: error.meta.target });
      }

      return res.status(500).json({ message: "Error", error });
    }
  }
}

async function createToken(user: any) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const token = process.env.JWT_SECRET!;

  return jwt.sign(payload, token, {
    expiresIn: "30d",
  });
}
