

export default async (request: Request) => {
  try {
    // 1. Fetch API Key from environment
    const key = process.env.FOOTBALL_API_KEY || process.env.FOOTBALL_DATA_API_KEY;

    if (!key) {
      return new Response(
        JSON.stringify({ error: "API key is missing in Netlify dashboard settings" }), 
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Extract path and search params natively using the Request object
    const incomingUrl = new URL(request.url);
    
    // Grab everything after '/api' or falling back to the function name matching
    let cleanPath = incomingUrl.pathname;
    if (cleanPath.startsWith('/api')) {
      cleanPath = cleanPath.replace(/^\/api/, "");
    } else {
      cleanPath = cleanPath.substring(cleanPath.indexOf('/api') + 4);
    }

    // Validation guard clause
    if (!cleanPath || cleanPath === '/') {
      return new Response(
        JSON.stringify({ error: "Missing endpoint sub-resource. Use /competitions/PL/matches" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Assemble target endpoint (preserves all original query strings natively)
    const targetUrl = `https://api.football-data.org/v4${cleanPath}${incomingUrl.search}`;

    // 4. Outbound Request via native fetch api (Bypasses old 'https' stream chunk loops)
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "X-Auth-Token": String(key).trim(),
        "Content-Type": "application/json"
      }
    });

    const rawData = await response.text();

    return new Response(rawData, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token"
      }
    });

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Crash" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}