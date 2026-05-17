/** Exposes public form config from Vercel environment variables. */
export default function handler(_request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({
    web3formsAccessKey: process.env.WEB3FORMS_ACCESS_KEY || "",
  });
}
