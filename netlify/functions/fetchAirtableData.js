// main/netlify/functions/fetchAirtableData.js
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const airtableToken = process.env.AIRTABLE_PAT; // Access Airtable PAT securely from Netlify env variables
    const airtableURL = 'https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE_NAME'; // Replace with your Airtable details

    try {
        const response = await fetch(airtableURL, {
            headers: {
                Authorization: `Bearer ${airtableToken}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.error.message }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data from Airtable' }),
        };
    }
};
