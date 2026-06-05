require('dotenv').config();
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function test() {
  try {
    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA4_CLIENT_EMAIL,
        private_key: process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n')
      }
    });

    const [response] = await client.runReport({
      property: 'properties/521204692',
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today'
        }
      ],
      metrics: [
        {
          name: 'sessions'
        }
      ]
    });

    console.log('SUCCESS');
    console.log(response);

  } catch (err) {
    console.error('ERROR CODE:', err.code);
    console.error('ERROR MESSAGE:', err.message);
    console.error(err);
  }
}

test();