import type { NextApiRequest, NextApiResponse } from 'next'
import QRCode from 'qrcode'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
