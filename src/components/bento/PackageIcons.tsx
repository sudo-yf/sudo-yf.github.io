import React from 'react'
import {
    SiReact,
    SiVuedotjs,
    SiAngular,
    SiSvelte,
    SiNextdotjs,
    SiNuxtdotjs,
    SiAstro,
    SiTypescript,
    SiJavascript,
    SiNodedotjs,
    SiExpress,
    SiNestjs,
    SiVite,
    SiWebpack,
    SiTailwindcss,
} from 'react-icons/si'
import { Package } from 'lucide-react'

export const getPackageIcon = (packageName: string): React.ReactElement => {
    const name = packageName.toLowerCase()

    const iconMap: Record<string, React.ReactElement> = {
        react: <SiReact />,
        vue: <SiVuedotjs />,
        angular: <SiAngular />,
        svelte: <SiSvelte />,
        next: <SiNextdotjs />,
        nextjs: <SiNextdotjs />,
        'next.js': <SiNextdotjs />,
        nuxt: <SiNuxtdotjs />,
        astro: <SiAstro />,
        typescript: <SiTypescript />,
        javascript: <SiJavascript />,
        'node.js': <SiNodedotjs />,
        node: <SiNodedotjs />,
        express: <SiExpress />,
        nestjs: <SiNestjs />,
        vite: <SiVite />,
        webpack: <SiWebpack />,
        tailwindcss: <SiTailwindcss />,
        tailwind: <SiTailwindcss />,
    }

    return iconMap[name] || <Package size={16} />
}
