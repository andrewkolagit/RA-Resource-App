const fetch = require('node-fetch'); // Make sure to install node-fetch

exports.handler = async (event, context) => {
    // Check for the correct HTTP method
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' })
        };
    }

    const { feedback } = JSON.parse(event.body); // Parse the incoming request body

    const url = `https://api.airtable.com/v0/${process.env.FEEDBACK_BASE_ID}/feedback_form`; // Replace YOUR_TABLE_NAME
    const apiKey = process.env.FEEDBACK_PAT; // Access API key from environment variables

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    feedback: feedback // Using "feedback" as the column name
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Feedback submitted successfully!' })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error submitting feedback. Please try again later.' })
        };
    }
};
