import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Remark plugin to transform Obsidian-style image embeds (![[image.png]])
 * into standard Markdown image syntax.
 * It checks for the image in:
 * 1. The same directory as the markdown file
 * 2. An 'assets' subdirectory
 * 3. Default to ./assets/ if not found (or for safety)
 */
const remarkObsidianImages: Plugin<[], Root> = () => {
    return (tree, file) => {
        const filePath = file.history[0] || file.path
        if (!filePath) return

        const fileDir = path.dirname(filePath)

        visit(tree, 'text', (node, index, parent) => {
            if (!parent || index === undefined) return

            const text = node.value
            // Match Obsidian image syntax: ![[image.png]]
            // Also supports ![[image.png|alt text]] but we just capture filename for now
            // Simplified regex to capture filename
            const obsidianImageRegex = /!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g

            if (obsidianImageRegex.test(text)) {
                const parts: any[] = []
                let lastIndex = 0

                // Reset regex
                obsidianImageRegex.lastIndex = 0
                let match

                while ((match = obsidianImageRegex.exec(text)) !== null) {
                    // Add text before the match
                    if (match.index > lastIndex) {
                        parts.push({
                            type: 'text',
                            value: text.slice(lastIndex, match.index),
                        })
                    }

                    // Add the image node
                    const imageName = match[1].trim()

                    // Check existence
                    const sameDir = path.join(fileDir, imageName)
                    const assetsDir = path.join(fileDir, 'assets', imageName)

                    let finalUrl = `./assets/${imageName}` // Default fallback

                    if (fs.existsSync(sameDir)) {
                        finalUrl = `./${imageName}`
                    } else if (fs.existsSync(assetsDir)) {
                        finalUrl = `./assets/${imageName}`
                    }

                    parts.push({
                        type: 'image',
                        url: finalUrl,
                        alt: imageName.replace(/\.[^.]+$/, ''), // Remove extension for alt text
                    })

                    lastIndex = match.index + match[0].length
                }

                // Add remaining text
                if (lastIndex < text.length) {
                    parts.push({
                        type: 'text',
                        value: text.slice(lastIndex),
                    })
                }

                // Replace the text node with the new nodes
                parent.children.splice(index, 1, ...parts)
            }
        })
    }
}

export default remarkObsidianImages
