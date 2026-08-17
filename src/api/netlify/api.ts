import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import https from 'https';

const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  try {
    const key = process.env.FOOTBALL_API_KEY || process.env.FOOTBALL_DATA_API_KEY;

    if (!key) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "API key is missing in Netlify dashboard settings" })
      };
    }

    // Resolves both direct /api calls and internal Netlify function system paths
    let cleanPath = event.path;
    if (cleanPath.includes('/.netlify/functions/')) {
      const parts = cleanPath.split(/\/\.netlify\/functions\/[^\/]+/);
      cleanPath = parts[1] || "";
    } else {
      cleanPath = cleanPath.replace(/^\/api/, "");
    }

    if (!cleanPath) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid API resource path specified" })
      };
    }

    const queryParams = event.queryStringParameters as Record<string, string> | null;
    const query = queryParams && Object.keys(queryParams).length > 0 
      ? `?${new URLSearchParams(queryParams)}` 
      : "";
      
    const url = `https://api.football-data.org/v4${cleanPath}${query}`;

    return new Promise<HandlerResponse>((resolve) => {
      https.get(url, {
        headers: {
          "X-Auth-Token": String(key).trim(),
          "Content-Type": "application/json"
        }
      }, (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type"
            },
            body: rawData
          });
        });
      }).on('error', (err) => {
        resolve({
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: `Outbound connection error: ${err.message}` })
        });
      });
    });

  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Internal Server Crash" })
    };
  }
};

export { handler };


