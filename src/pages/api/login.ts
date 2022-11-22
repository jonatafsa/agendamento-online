// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Process a POST request
  const prisma = new PrismaClient();
  console.log(req.body);

  try {
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        username: req.body.username,
      },
    });

    if (user.password !== req.body.password) {
      throw new Error("Senha incorreta", {
        cause: "password",
      });
    }

    const token = await createToken(user);
    res.status(200).json({ message: "Logado com sucesso", token });
  } catch (error: any) {
    if (error.cause === "password") {
      res.status(401).json({ message: error.message, target: error.cause });
    }

    if (error.message === "No users found") {
      res.status(401).json({ message: error.message, target: "username" });
    }

    return res.status(500).json({ message: error.message, error });
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
    expiresIn: "2d",
  });
}
