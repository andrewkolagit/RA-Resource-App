const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const baseId = process.env.AIRTABLE_BASE_ID; // Access the Base ID from environment variables
        const apiKey = process.env.AIRTABLE_PAT; // Access the PAT from environment variables
        
        // Get the table name from the query parameter
        const tableName = event.queryStringParameters.table;
        if (!tableName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Table name is required' }),
            };
        }

        // Construct the Airtable API URL using the provided table name
        const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${apiKey}` // Include the PAT in the request header
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data), // Return the data received from Airtable
        };
    } catch (error) {
        console.error('Error in airtable-proxy function:', error); // Log the error for debugging
        return {
            statusCode: error.response?.status || 500, // Return the error status or 500 if unknown
            body: JSON.stringify({ error: 'Failed to fetch data from Airtable' }), // Return a user-friendly error message
        };
    }
};
