export default async function handler(req, res) {
  try {
    const { query, lat, lng, radius = 20000, offset = 0, limit = 24 } = req.query;
    const params = new URLSearchParams({
      r_locale: 'da_DK',
      r_lat: lat || '55.676',
      r_lng: lng || '12.568',
      r_radius: radius,
      offset,
      limit,
    });
    if (query) params.set('query', query);

    const url = `https://api.etilbudsavis.dk/v2/offers/search?${params.toString()}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
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
