// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Verifica se o usuário tem um TOKEN
  if (req.body.token) {
    //Cria uma variável para receber a origem da requisição
    const requestID = req.body.requestID;

    //Função que Verifica se o TOKEN é válido, passando 3 parâmetros
    jwt.verify(
      req.body.token, //primeiro parametro, Token recebido
      process.env.JWT_SECRET!, //segundo parametro, Secret do Token

      //terceiro parametro, função de callback
      async (err: any, decoded: any) => {
        //Se o token for inválido, retorna um erro
        if (err) {
          return res.status(401).json({ status: "Unauthorized" });
        }

        //Se o TOKEN for válido, desestrutura os dados do Token
        const { id, exp } = decoded;

        //Verifica se o Token expirou
        if (exp < Date.now() / 1000) {
          //Se o Token expirou, retorna um erro
          return res.status(401).json({ status: "Unauthorized" });
        }

        //Se o Token não expirou, cria um refreshToken
        const refreshToken = jwt.sign(
          { id, requestID },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        );

        //Retorna o refreshToken
        return res.status(200).json({ status: "OK", refreshToken });
      }
    );
  } else {
    //Se o usuário não tiver um Token, retorna um erro
    res.status(401).json({ status: "Unauthorized" });
  }
}
