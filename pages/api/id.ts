import type { NextApiRequest, NextApiResponse } from 'next'
import clientIdentifier from "./clientId.json";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(clientIdentifier)
}
