import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import http from 'k6/http';
import { sleep } from 'k6';

const url = 'http://localhost:3000/reviews';

export const options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<1500'],
  },
};

const randomProductId = Math.floor(Math.random() * (1000012 - 1) + 1);
const randomReviewId = Math.floor(Math.random() * (5774952 - 1) + 1);
const lastTenPercentProductId = Math.floor(Math.random() * (1000012 - 900010 + 1) + 900010);

export default function () {
  // http.get(`${url}?product_id=${lastTenPercentProductId}`);
  http.get(`${url}/meta?product_id=${lastTenPercentProductId}`);
  // http.put(`${url}/${randomReviewId}/helpful`);
  sleep(1);
}

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
  };
}
