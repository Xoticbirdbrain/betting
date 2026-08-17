import type { Handler, HandlerEvent } from '@netlify/functions';

const handler: Handler = async (event: HandlerEvent) => {
  try {
    const key = process.env.FOOTBALL_API_KEY;

     console.log("---- SERVERLESS AUTH CHECK ----");
    console.log("Detected Key Value:", key ? `Valid (${key.substring(0, 4)}...)` : "⚠️ ABSOLUTELY MISSING");
    console.log("Full Proxy Target URL:", `https://football-data.org{event.path.replace("/api", "")}`);
    console.log("-------------------------------");


    if (!key) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key missing" })
      };
    }

    
    const cleanPath = event.path.split('/').pop(); 
    const path = cleanPath ? `/${cleanPath}` : "/matches";
    
  
    const queryParams = event.queryStringParameters as Record<string, string> | null;
    const query = queryParams && Object.keys(queryParams).length > 0 
      ? `?${new URLSearchParams(queryParams)}` 
      : "";
      
    const url = `https://api.football-data.org/v4${path}${query}`;

    const res = await fetch(url, {
      method: event.httpMethod,
      headers: {
        "X-Auth-Token": key, 
        "Content-Type": "application/json" 
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
