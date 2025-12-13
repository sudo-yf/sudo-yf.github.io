import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
    const apiKey = import.meta.env.PUBLIC_WAKATIME_API_KEY

    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: 'API key not configured' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }

    try {
        const response = await fetch(
            `https://wakatime.com/api/v1/users/current/stats/last_7_days?api_key=${apiKey}`
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('WakaTime API error:', response.status, errorText)
            return new Response(
                JSON.stringify({ error: `WakaTime API returned ${response.status}` }),
                { status: response.status, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const data = await response.json()

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
            },
        })
    } catch (error) {
        console.error('WakaTime proxy error:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to fetch WakaTime data' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}
