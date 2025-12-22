
import { memo } from 'react'
import { FaGithub } from 'react-icons/fa'
import { cn } from '@/lib/utils'
import AvatarComponent from '@/components/ui/avatar'
import { getBaseUrl } from '@/lib/path-utils'

const BASE_URL = getBaseUrl()

const UserInfo = memo(() => (
    <div className="bg-border/50 flex flex-col gap-y-1 p-3">
        <span className="text-base leading-none">sudo-yf</span>
        <span className="text-muted-foreground text-xs leading-none">
            @sudo-yf
        </span>
    </div>
))

const AvatarSection = memo(() => (
    <div className="flex justify-between gap-x-1">
        <div className="relative">
            <AvatarComponent
                src={`${BASE_URL}static/bento/avatar.jpg`}
                alt="Avatar"
                fallback="YF"
                className="-mt-12 aspect-square grayscale sepia-50 size-16 rounded-full sm:-mt-[4.5rem] sm:size-24"
            />
            <div className="ring-muted absolute right-1 bottom-1 size-4 rounded-full ring-6 bg-primary flex items-center justify-center">
                <div className="bg-background size-[10px] rounded-full" />
            </div>
        </div>
    </div>
))

const GithubIcon = memo(() => (
    <div className="bg-primary absolute top-0 right-0 m-3 flex size-14 items-center justify-center rounded-full">
        <FaGithub className="text-background size-10" />
    </div>
))

const RichGithubCard = memo(() => {
    return (
        <div
            data-trigger
            className="group/discord relative size-full overflow-hidden"
        >
            <div className="grid size-full grid-rows-4">
                {/* Banner */}
                <div
                    className="bg-border/25 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${BASE_URL}static/bento/github-background.png')` }}
                />

                <div className="bg-muted row-span-3 flex flex-col gap-3 p-3">
                    <AvatarSection />
                    <UserInfo />

                    {/* Activity Content */}
                    <div className="bg-border/50 flex-1 p-3">
                        <div className="flex size-full items-center gap-x-2 sm:gap-x-3">
                            <div className="relative aspect-square h-full max-h-12 shrink-0 sm:max-h-16">
                                <div
                                    style={{ backgroundImage: `url('${BASE_URL}static/bento/bento-discord-futon.svg')` }}
                                    className="absolute inset-0 bg-contain bg-center bg-no-repeat grayscale sepia-50"
                                />
                            </div>
                            <div className="flex flex-1 flex-col gap-y-1 py-1">
                                <div className="mb-0.5 line-clamp-1 text-xs leading-none">
                                    Coding
                                </div>
                                <div className="text-muted-foreground line-clamp-2 text-[11px] leading-none">
                                    Developing yfblog
                                </div>
                                <div className="text-muted-foreground text-[11px] leading-none">
                                    00:42 elapsed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <GithubIcon />
        </div>
    )
})

export default RichGithubCard
