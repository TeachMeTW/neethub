import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/libs/prismadb';
import serverAuth from '@/libs/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await serverAuth(req, res);
        const movies = await prismadb.movie.findMany();
        return res.status(200).json(movies);
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}