import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Remark plugin to transform Obsidian-style embeds and links:
 * - ![[image.png]] -> image embed
 * - ![[image.png|500]] -> image embed with width
 * - ![[document.pdf]] -> PDF iframe embed
 * - [[page-name]] -> internal link
 */
const remarkObsidianImages: Plugin<[], Root> = () => {
    return (tree, file) => {
        const filePath = file.history[0] || file.path
        if (!filePath) return

        const fileDir = path.dirname(filePath)

        visit(tree, 'text', (node, index, parent) => {
            if (!parent || index === undefined) return

            const text = node.value

            // Match both embeds (![[...]]) and wikilinks ([[...]])
            const obsidianRegex = /(!?)\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

            if (obsidianRegex.test(text)) {
                const parts: any[] = []
                let lastIndex = 0

                obsidianRegex.lastIndex = 0
                let match

                while ((match = obsidianRegex.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        parts.push({
                            type: 'text',
                            value: text.slice(lastIndex, match.index),
                        })
                    }

                    const isEmbed = match[1] === '!'
                    const fileName = match[2].trim()
                    const param = match[3]?.trim() // Could be width for images or alt text

                    if (isEmbed) {
                        // Handle embeds: ![[file]]
                        const ext = path.extname(fileName).toLowerCase()

                        // Check file existence in multiple locations
                        const sameDir = path.join(fileDir, fileName)
                        const assetsDir = path.join(fileDir, 'assets', fileName)
                        const parentAssetsDir = path.join(fileDir, '..', 'assets', fileName)

                        let finalUrl: string
                        if (fs.existsSync(sameDir)) {
                            finalUrl = `./${fileName}`
                        } else if (fs.existsSync(assetsDir)) {
                            finalUrl = `./assets/${fileName}`
                        } else if (fs.existsSync(parentAssetsDir)) {
                            finalUrl = `../assets/${fileName}`
                        } else {
                            // Fallback: try assets in same dir first, then parent
                            finalUrl = `./assets/${fileName}`
                        }

                        // Handle different file types
                        if (ext === '.pdf') {
                            // PDF embed: create an iframe or link
                            parts.push({
                                type: 'html',
                                value: `<div class="pdf-embed" style="margin: 1.5rem 0;">
  <iframe src="${finalUrl}" width="100%" height="600px" style="border: 1px solid #ccc; border-radius: 4px;"></iframe>
  <p style="margin-top: 0.5rem; font-size: 0.875rem;"><a href="${finalUrl}" target="_blank" rel="noopener noreferrer">📄 Open PDF in new tab</a></p>
</div>`
                            })
                        } else if (['.mp4', '.webm', '.ogg'].includes(ext)) {
                            // Video embed
                            parts.push({
                                type: 'html',
                                value: `<video controls style="max-width: 100%; height: auto; margin: 1rem 0;">
  <source src="${finalUrl}" type="video/${ext.slice(1)}">
  Your browser does not support the video tag.
</video>`
                            })
                        } else if (['.mp3', '.wav', '.ogg'].includes(ext)) {
                            // Audio embed
                            parts.push({
                                type: 'html',
                                value: `<audio controls style="width: 100%; margin: 1rem 0;">
  <source src="${finalUrl}" type="audio/${ext.slice(1)}">
  Your browser does not support the audio tag.
</audio>`
                            })
                        } else {
                            // Image embed (default)
                            const altText = param || fileName.replace(/\.[^.]+$/, '')

                            // Check if param is a number (width)
                            const width = param && /^\d+$/.test(param) ? param : null

                            if (width) {
                                // Image with custom width
                                parts.push({
                                    type: 'html',
                                    value: `<img src="${finalUrl}" alt="${altText}" style="max-width: ${width}px; height: auto;" />`
                                })
                            } else {
                                // Standard image node
                                parts.push({
                                    type: 'image',
                                    url: finalUrl,
                                    alt: altText,
                                })
                            }
                        }
                    } else {
                        // Handle wikilinks: [[page-name]] or [[page-name|display text]]
                        const displayText = param || fileName

                        // Convert to URL-friendly slug
                        const slug = fileName.toLowerCase().replace(/\s+/g, '-')

                        parts.push({
                            type: 'link',
                            url: `/blog/${slug}`,
                            children: [
                                {
                                    type: 'text',
                                    value: displayText
                                }
                            ]
                        })
                    }

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
