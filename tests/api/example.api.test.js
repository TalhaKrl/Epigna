const fetch = require('node-fetch');

test('GET /api/health returns 200', async () => {
  const response = await fetch('http://localhost:3000/api/health');
  expect(response.status).toBe(200);
});
