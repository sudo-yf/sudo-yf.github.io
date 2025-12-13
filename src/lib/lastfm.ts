// Last.fm API utilities
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

export interface LastfmTrack {
    name: string;
    artist: string;
    album: string;
    image: string;
    url: string;
    nowPlaying?: boolean;
    date?: string;
}

export interface LastfmUser {
    name: string;
    playcount: string;
    url: string;
}

/**
 * Fetch recent tracks from Last.fm
 */
export async function getRecentTracks(
    username: string,
    apiKey: string,
    limit: number = 1
): Promise<LastfmTrack[]> {
    try {
        const params = new URLSearchParams({
            method: 'user.getrecenttracks',
            user: username,
            api_key: apiKey,
            format: 'json',
            limit: limit.toString(),
        });

        const response = await fetch(`${LASTFM_API_URL}?${params}`);

        if (!response.ok) {
            throw new Error(`Last.fm API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.recenttracks?.track) {
            return [];
        }

        const tracks = Array.isArray(data.recenttracks.track)
            ? data.recenttracks.track
            : [data.recenttracks.track];

        return tracks.map((track: any) => ({
            name: track.name || 'Unknown Track',
            artist: track.artist?.['#text'] || track.artist || 'Unknown Artist',
            album: track.album?.['#text'] || track.album || 'Unknown Album',
            image: track.image?.find((img: any) => img.size === 'large')?.['#text'] ||
                track.image?.[track.image.length - 1]?.['#text'] || '',
            url: track.url || '',
            nowPlaying: track['@attr']?.nowplaying === 'true',
            date: track.date?.uts ? new Date(parseInt(track.date.uts) * 1000).toISOString() : undefined,
        }));
    } catch (error) {
        console.error('Failed to fetch Last.fm data:', error);
        return [];
    }
}

/**
 * Fetch user info from Last.fm
 */
export async function getUserInfo(
    username: string,
    apiKey: string
): Promise<LastfmUser | null> {
    try {
        const params = new URLSearchParams({
            method: 'user.getinfo',
            user: username,
            api_key: apiKey,
            format: 'json',
        });

        const response = await fetch(`${LASTFM_API_URL}?${params}`);

        if (!response.ok) {
            throw new Error(`Last.fm API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.user) {
            return null;
        }

        return {
            name: data.user.name || username,
            playcount: data.user.playcount || '0',
            url: data.user.url || `https://www.last.fm/user/${username}`,
        };
    } catch (error) {
        console.error('Failed to fetch Last.fm user info:', error);
        return null;
    }
}

/**
 * Fetch top artists from Last.fm
 */
export async function getTopArtists(
    username: string,
    apiKey: string,
    period: '7day' | '1month' | '3month' | '6month' | '12month' | 'overall' = '1month',
    limit: number = 5
): Promise<Array<{ name: string; playcount: string; url: string }>> {
    try {
        const params = new URLSearchParams({
            method: 'user.gettopartists',
            user: username,
            api_key: apiKey,
            period,
            limit: limit.toString(),
            format: 'json',
        });

        const response = await fetch(`${LASTFM_API_URL}?${params}`);

        if (!response.ok) {
            throw new Error(`Last.fm API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.topartists?.artist) {
            return [];
        }

        const artists = Array.isArray(data.topartists.artist)
            ? data.topartists.artist
            : [data.topartists.artist];

        return artists.map((artist: any) => ({
            name: artist.name || 'Unknown',
            playcount: artist.playcount || '0',
            url: artist.url || '',
        }));
    } catch (error) {
        console.error('Failed to fetch Last.fm top artists:', error);
        return [];
    }
}
