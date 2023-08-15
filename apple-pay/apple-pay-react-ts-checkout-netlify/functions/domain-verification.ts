import axios from "axios";

exports.handler = async function(event: any, context: any) {
    try {
        // Fetch the Tilled domain verification file from Tilled and return it as a response
        const response = await axios.get('https://api.tilled.com/apple-developer-merchantid-domain-association');
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain',
            },
            body: response.data,
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: 'An error occurred while fetching the file.',
        };
    }
}