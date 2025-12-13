import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Remark plugin to transform Obsidian-style image embeds (![[image.png]])
 * into standard Markdown image syntax with absolute paths.
 */
const remarkObsidianImages: Plugin<[], Root> = () => {
    return (tree, file) => {
        const filePath = file.history[0] || file.path
        if (!filePath) return

        const fileDir = path.dirname(filePath)
        // Get the blog directory path (relative to project root)
        const blogRoot = path.join(process.cwd(), 'blog')
        const relativeToBlog = path.relative(blogRoot, fileDir)

        visit(tree, 'text', (node, index, parent) => {
            if (!parent || index === undefined) return

            const text = node.value
            const obsidianImageRegex = /!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g

            if (obsidianImageRegex.test(text)) {
                const parts: any[] = []
                let lastIndex = 0

                obsidianImageRegex.lastIndex = 0
                let match

                while ((match = obsidianImageRegex.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        parts.push({
                            type: 'text',
                            value: text.slice(lastIndex, match.index),
                        })
                    }

                    const imageName = match[1].trim()

                    // Check existence in filesystem
                    const sameDir = path.join(fileDir, imageName)
                    const assetsDir = path.join(fileDir, 'assets', imageName)

                    // Generate absolute URL from /blog/ root
                    let finalUrl: string

                    if (fs.existsSync(sameDir)) {
                        // Image in same directory as markdown
                        finalUrl = `/blog/${relativeToBlog}/${imageName}`.replace(/\\/g, '/')
                    } else if (fs.existsSync(assetsDir)) {
                        // Image in assets subdirectory
                        finalUrl = `/blog/${relativeToBlog}/assets/${imageName}`.replace(/\\/g, '/')
                    } else {
                        // Fallback
                        finalUrl = `/blog/assets/${imageName}`.replace(/\\/g, '/')
                    }

                    // Clean up double slashes
                    finalUrl = finalUrl.replace(/\/+/g, '/')

                    parts.push({
                        type: 'image',
                        url: finalUrl,
                        alt: imageName.replace(/\.[^.]+$/, ''),
                    })

                    lastIndex = match.index + match[0].length
                }

                if (lastIndex < text.length) {
                    parts.push({
                        type: 'text',
                        value: text.slice(lastIndex),
                    })
                }

                parent.children.splice(index, 1, ...parts)
            }
        })
    }
}

export default remarkObsidianImages
