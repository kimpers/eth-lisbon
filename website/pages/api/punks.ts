import { NextApiRequest, NextApiResponse } from 'next';
import punks from '../../utils/punks.json';

// Get 2 random Punks' image URLs
const handlePunks = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('req :', req);
  console.log('res :', res);

  try {
    // Generate random index based on number of keys
    const punkObj: any = punks;
    const punkKeys: string[] = Object.keys(punkObj);
    const randIndex1: number = Math.floor(Math.random() * punkKeys.length);
    const randIndex2: number = Math.floor(Math.random() * punkKeys.length);

    const punk1 = punkObj[punkKeys[randIndex1]];
    const punk2 = punkObj[punkKeys[randIndex2]];
    res.status(200).json([punk1, punk2]);
  } catch (err: any) {
    console.error(err);
    const statusCode = err.statusCode === 404 ? 404 : 500;
    const message = err.statusCode === 404 ? 'NOT_FOUND' : 'UNEXPECTED_ERROR';
    const errResponse = { message };
    res.status(statusCode).json(errResponse);
  }
};

export default handlePunks;
