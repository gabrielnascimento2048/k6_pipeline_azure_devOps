import { fail, check, sleep } from 'k6';
import http from 'k6/http';
import { Counter, Rate, Trend } from 'k6/metrics';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    get_k6_fail_rate: ['rate<1'], // Threshold personalizado para a taxa de falhas (menor que 1%)

  },
};


export let GetDuration = Trend('get_k6_duration');
export let failRate = Rate('get_k6_fail_rate');
export let GetSuccessRate = Rate('get_k6_success_Rate');
export let GetRequests = new Counter('get_k6_reqs');

export default function () {
  let res = http.get('http://test.k6.io')
  GetDuration.add(res.timings.duration);
  GetRequests.add(1);
  failRate.add(res.status == 0 || res.status > 399);
  GetSuccessRate.add(res.status < 399);

  let isRequestSuccessful = check(res, {
    'is status 200': (r) => r.status === 200,
  });

  failRate.add(!isRequestSuccessful);

let durationMessage = 'Max Duration ${1000/1000}s'
if(!check(res,{
    'max duration': (r) => r.timings.duration < 1000
})){
    fail(durationMessage);
}


sleep(1);
}