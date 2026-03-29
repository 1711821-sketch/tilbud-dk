import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const API_KEY = 'SG_APIM_GVMQS9BQPGJ0AMEFN9W5R66H7W6VZ52FY8ZWK991WGR4KM11QKKG';
const BASE_URL = 'https://api.sallinggroup.com/v1/food-waste';

app.get('/api/food-waste', async (req, res) => {
  try {
    const { zip, geo, radius } = req.query;
    const params = new URLSearchParams();
    if (zip) params.set('zip', zip);
    if (geo) params.set('geo', geo);
    if (radius) params.set('radius', radius);

    const url = `${BASE_URL}?${params.toString()}`;
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
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/offers', async (req, res) => {
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
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('API proxy running on http://localhost:3001');
});
