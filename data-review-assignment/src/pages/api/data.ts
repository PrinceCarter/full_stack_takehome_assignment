import { MOCK_DATA } from "consts/data";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(MOCK_DATA);
}
