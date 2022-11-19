import { main } from 'app/main.ts'
export default async function(request) {
    const week = new URL(request.url).searchParams.get("week");
    const predictions = await main({ week: parseInt(week), verbose: false, log:false });
    return new Response(JSON.stringify(predictions));
} 

