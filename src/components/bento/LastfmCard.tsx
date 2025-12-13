import { useEffect, useState } from 'react'
import { AudioLines, MoveUpRight, Music } from 'lucide-react'
import type { LastfmTrack } from '@/lib/lastfm'

interface LastfmCardProps {
    username: string
    apiKey: string
}

const LastfmCard = ({ username, apiKey }: LastfmCardProps) => {
    const [track, setTrack] = useState<LastfmTrack | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const params = new URLSearchParams({
                    method: 'user.getrecenttracks',
                    user: username,
                    api_key: apiKey,
                    format: 'json',
                    limit: '1',
                })

                const response = await fetch(
                    `https://ws.audioscrobbler.com/2.0/?${params}`
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch Last.fm data')
                }

                const data = await response.json()

                if (data.recenttracks?.track) {
                    const latestTrack = Array.isArray(data.recenttracks.track)
                        ? data.recenttracks.track[0]
                        : data.recenttracks.track

                    setTrack({
                        name: latestTrack.name || 'Unknown Track',
                        artist:
                            latestTrack.artist?.['#text'] || latestTrack.artist || 'Unknown Artist',
                        album:
                            latestTrack.album?.['#text'] || latestTrack.album || 'Unknown Album',
                        image:
                            latestTrack.image?.find((img: any) => img.size === 'large')?.['#text'] ||
                            latestTrack.image?.[latestTrack.image.length - 1]?.['#text'] ||
                            '',
                        url: latestTrack.url || '',
                        nowPlaying: latestTrack['@attr']?.nowplaying === 'true',
                    })
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load music data')
            } finally {
                setLoading(false)
            }
        }

        fetchTrack()
        const interval = setInterval(fetchTrack, 30000)
        return () => clearInterval(interval)
    }, [username, apiKey])

    if (loading) {
        return (
            <div className="flex size-full items-center justify-center p-6">
                <div className="text-muted-foreground flex items-center gap-2">
                    <Music className="animate-pulse" size={20} />
                    <span>Loading music...</span>
                </div>
            </div>
        )
    }

    if (error || !track) {
        return (
            <div className="flex size-full items-center justify-center p-6">
                <div className="text-muted-foreground text-center text-sm">
                    <Music size={20} className="mx-auto mb-2 opacity-50" />
                    <p>No recent tracks</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="relative flex size-full flex-col justify-between gap-4 p-6">
                {track.image ? (
                    <div
                        className="aspect-square min-h-0 max-w-[60%] flex-shrink border bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${track.image}')`,
                        }}
                        role="img"
                        aria-label="Album art"
                    />
                ) : (
                    <div className="bg-muted flex aspect-square min-h-0 max-w-[60%] flex-shrink items-center justify-center border">
                        <Music className="text-muted-foreground" size={48} />
                    </div>
                )}
                <div className="flex min-h-0 flex-shrink-0 flex-col justify-end">
                    <div className="mr-8 flex flex-col">
                        <span className="mb-2 flex items-center gap-2">
                            <AudioLines size={16} className="text-primary" />
                            <span className="text-primary text-sm">
                                {track.nowPlaying ? 'Now playing...' : 'Last played...'}
                            </span>
                            {track.nowPlaying && (
                                <span className="relative flex h-2 w-2">
                                    <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                                    <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
                                </span>
                            )}
                        </span>
                        <span className="text-md mb-2 line-clamp-2 font-medium leading-tight">
                            {track.name}
                        </span>
                        <span className="text-muted-foreground line-clamp-1 text-xs">
                            <span className="text-muted-foreground">by</span> {track.artist}
                        </span>
                        <span className="text-muted-foreground line-clamp-1 text-xs">
                            <span className="text-muted-foreground">on</span> {track.album}
                        </span>
                    </div>
                </div>
            </div>
            <a
                href={track.url || `https://www.last.fm/user/${username}`}
                aria-label="View on Last.fm"
                title="View on Last.fm"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-border/50 text-primary ring-ring group/lastfm-link absolute bottom-0 end-0 m-3 rounded-full p-3 transition-[box-shadow] duration-300 hover:ring-2 focus-visible:ring-2"
            >
                <MoveUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover/lastfm-link:rotate-12"
                />
            </a>
        </>
    )
}

export default LastfmCard
