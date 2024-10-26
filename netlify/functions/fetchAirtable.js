// netlify/functions/fetchAirtable.js

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const airtablePat = process.env.AIRTABLE_PAT; // Access your PAT
  const airtableBaseId = process.env.AIRTABLE_BASE_ID; // Access your Base ID
  
  // Get the table name from the query parameters
  const tableName = event.queryStringParameters.tableName;

  if (!tableName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Table name is required' }),
    };
  }

  try {
    const response = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${tableName}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${airtablePat}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
