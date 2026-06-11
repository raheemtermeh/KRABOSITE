import axios from "axios";

const allowedOrigin = "https://krabo.gold";

export default async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer || "";

  // if (!origin.startsWith(allowedOrigin)) {
  //   return res.status(403).json({ message: 'Forbidden: Invalid origin' });
  // }

  const { searchTerm, page } = req.query;

  try {
    const response = await axios.get(
      `https://python.krabo.gold/api/product-filter/`,
      {
        params: {
          name__icontains: searchTerm,
          page: page,
        },
      },
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
}
