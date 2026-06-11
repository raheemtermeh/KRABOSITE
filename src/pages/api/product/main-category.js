import axios from "axios";

const allowedOrigin = "https://krabo.gold";

export default async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer || ""; // Fallback to referer or empty string

  // if (!origin.startsWith(allowedOrigin)) {
  //   return res.status(403).json({ message: 'Forbidden: Invalid origin' });
  // }

  const { main, sub_categories, price__gte, price__lte, event_list, page } =
    req.query;

  try {
    const response = await axios.get(
      `https://python.krabo.gold/api/product/${main}/${sub_categories}/?properties__help_price__gte=${price__gte}&properties__help_price__lte=${price__lte}&even_type__in=${event_list}&page=${page}`,
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ message: "Error fetching data" });
  }
}
