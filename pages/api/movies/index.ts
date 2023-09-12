import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    await serverAuth(req, res);

    const classifier = req.query.classifier;

    let queryOptions = {
      where: {
        classifier: 'movie'
      }
    };
    if (classifier) {
      queryOptions = {
        where: {
          classifier: classifier as string
        }
      };
    }

    const movies = await prismadb.movie.findMany(queryOptions);

    return res.status(200).json(movies);
  } catch (error) {
    console.log({ error });
    return res.status(500).end();
  }
}
