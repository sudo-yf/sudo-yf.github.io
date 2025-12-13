/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_WAKATIME_API_KEY: string
    readonly PUBLIC_GITHUB_USERNAME: string
    readonly PUBLIC_DISCORD_USER_ID: string
    readonly PUBLIC_SPOTIFY_CLIENT_ID: string
    readonly PUBLIC_SPOTIFY_CLIENT_SECRET: string
    readonly PUBLIC_SPOTIFY_REFRESH_TOKEN: string
    readonly PUBLIC_LASTFM_API_KEY: string
    readonly PUBLIC_LASTFM_USERNAME: string
    readonly PUBLIC_WAKATIME_SHARE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
