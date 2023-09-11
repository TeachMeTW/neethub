import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, imgSrc } = req.body;

    if (!userId || !imgSrc) {
      return res.status(400).json({ error: 'userId and imgSrc are required' });
    }
    
    await serverAuth(req, res);

    try {
      // Assuming you have a User model with an image field in your Prisma schema
      await prismadb.user.update({
        where: { id: userId },
        data: { image: imgSrc }
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user profile image' });
    }
  } else {
    res.status(405).end();  // Method Not Allowed
  }
}
