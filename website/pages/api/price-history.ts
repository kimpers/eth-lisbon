import { NextApiRequest, NextApiResponse } from 'next';
import { YAM_PUNK_PRICE_URL } from '../../utils/config';

// Get price history of punk floor
const handlePriceHistory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const priceRes = await fetch(YAM_PUNK_PRICE_URL);
    const resJson = await priceRes.json();
    res.status(200).json(resJson);
  } catch (err: any) {
    // console.error(err.message);
    const statusCode = err.statusCode === 404 ? 404 : 500;
    const message = err.statusCode === 404 ? 'NOT_FOUND' : 'UNEXPECTED_ERROR';
    const errResponse = { message };
    res.status(statusCode).json(errResponse);
  }
};

export default handlePriceHistory;
