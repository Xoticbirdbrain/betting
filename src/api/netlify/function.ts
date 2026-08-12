import type { Handler, HandlerEvent } from '@netlify/functions';

const handler: Handler = async (event: HandlerEvent) => {
  try {
    const key = process.env.FOOTBALL_API_KEY;
    if (!key) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key missing" })
      };
    }

    
    const path = event.path.replace("/.netlify/functions/api", "");
    
  
    const queryParams = event.queryStringParameters as Record<string, string> | null;
    const query = queryParams && Object.keys(queryParams).length > 0 
      ? `?${new URLSearchParams(queryParams)}` 
      : "";
      
    const url = `https://api.football-data.org/v4${path}${query}`;

    const res = await fetch(url, {
      method: event.httpMethod,
      headers: {
        "X-Auth-Token": key, // Fixed casing (changed 'Key' to 'key')
        "Content-Type": "application/json" // Fixed typo 'appliation/json'
      },
      body: event.body || undefined
    });

    const data = await res.text();

    return {
      statusCode: res.status,
      headers: {
        "Content-Type": "application/json", // Fixed typo 'appliation/json'
        "Access-Control-Allow-Origin": "*"
      },
      body: data
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

export { handler };
