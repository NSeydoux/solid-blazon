import type { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';
import Cors from 'cors';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: typeof cors) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the CORS middleware
  await runMiddleware(req, res, cors)
  if (req.method?.toLowerCase() === "get") {
    if (req.query["webid"] === undefined) {
      return res.status(400).json({
        error: "missing_webid",
        error_description: "The webid should be passed in the query params."
      });
    }
    const webid = decodeURI(req.query["webid"] as string);
    const svgQrCode = await QRCode.toString(webid, {type: "svg"});
    return res.status(200).setHeader("Content-Type", "image/svg+xml").send(svgQrCode);
  }
  return res.status(405).json({
    error: "not_get",
    error_description: "Only GET is supported by this endpoint"
  });
}
