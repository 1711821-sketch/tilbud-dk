export default async function handler(req, res) {
  try {
    const { zip, geo, radius } = req.query;
    const params = new URLSearchParams();
    if (zip) params.set('zip', zip);
    if (geo) params.set('geo', geo);
    if (radius) params.set('radius', radius);

    const API_KEY = process.env.SALLING_API_KEY;
    const url = `https://api.sallinggroup.com/v1/food-waste?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
