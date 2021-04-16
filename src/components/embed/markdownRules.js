import React from 'react'
import markdown from 'simple-markdown'
import hljs from 'highlight.js'
import st from './Markdown.sass'
import cn from 'classnames'
import { emojis } from '../emojis'
import { EmojiImg } from '../emoji'

const EMOJI_NAME_AND_DIVERSITY_RE = /^:([^\s:]+?(?:::skin-tone-\d)?):/
const EMOJI_RE = /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/

const parseEmojis = str => str.replace(/:[a-zA-Z0-9_]{1,25}:/g, '___')

const getEmoteURL = (emote) =>
  `https://cdn.discordapp.com/emojis/${emote.id}.png`

const astToString = node => {
  function inner(node, result = []) {
    if (Array.isArray(node)) {
      node.forEach((subNode) => astToString(subNode, result))
    } else if (typeof node.content === 'string') {
      result.push(node.content)
    } else if (node.content != null) {
      astToString(node.content, result)
    }

    return result
  }

  return inner(node).join('')
}

export const base = {
  newline: markdown.defaultRules.newline,
  paragraph: {
    ...markdown.defaultRules.paragraph,
    react(node, recurseOutput, state) {
      return <text key={state.key}>{recurseOutput(node.content, state)}</text>
    }
  },
  escape: markdown.defaultRules.escape,
  link: {
    ...markdown.defaultRules.link,
    match() {
      return null
    },
    react(node, recurseOutput, state) {
      const children = recurseOutput(node.content, state)
      const title = node.title || astToString(node.content)
      return (
        <a
          title={title}
          href={markdown.sanitizeUrl(node.target)}
          target='_blank'
          rel='noreferrer'
          key={state.key}
        >
          {children}
        </a>
      )
    }
  },
  autolink: {
    ...markdown.defaultRules.autolink,
    match: markdown.inlineRegex(/^<(https?:\/\/[^ >]+)>/)
  },
  url: {
    ...markdown.defaultRules.url,
    match: markdown.inlineRegex(
      /^((https?|steam):\/\/[^\s<]+[^<.,:;"')\]\s])/
    )
  },
  strong: markdown.defaultRules.strong,
  em: markdown.defaultRules.em,
  u: markdown.defaultRules.u,
  inlineCode: {
    ...markdown.defaultRules.inlineCode,
    react(node, recurseOutput, state) {
      return (
        <code className={st.inline} key={state.key}>
          {node.content}
        </code>
      )
    }
  },
  spoiler: {
    order: markdown.defaultRules.text.order,
    match(source) {
      return /^\|\|(.*?)\|\|/gm.exec(source)
    },
    parse(capture) {
      return { content: capture[1] }
    },
    react(node, recurseOutput, state) {
      return <MarkdownSpoiler key={state.key}>{node.content}</MarkdownSpoiler>
    }
  },
  emoji: {
    order: markdown.defaultRules.text.order,
    match(source) {
      return EMOJI_RE.exec(source)
    },
    parse(capture) {
      return { e: emojis.get(emojis.getName(capture[0])) }
    },
    react(node, recurseOutput, state) {
      return <EmojiImg size={20} {...node.e} key={state.key} />
    }
  },
  nameEmoji: {
    order: markdown.defaultRules.text.order,
    match(source) {
      return EMOJI_NAME_AND_DIVERSITY_RE.exec(source)
    },
    parse(capture) {
      return { e: emojis.get(emojis.getName(capture[0])), text: capture[0] }
    },
    react(node, recurseOutput, state) {
      return node.e
      ? <EmojiImg size={20} {...node.e} className={st.demoji} key={state.key} />
      : node.text
    }
  },
  discordEmoji: {
    order: markdown.defaultRules.text.order,
    match(source) {
      return /^<:(\w+):(\d+)>/.exec(source)
    },
    parse(capture) {
      const name = capture[1]
      const id = capture[2]
      return {
        emojiId: id,
        name: name,
        src: getEmoteURL({
          id: id
        })
      }
    },
    react(node, recurseOutput, state) {
      return (
        <img
          draggable={false}
          className={st.demoji}
          alt={`<:${node.name}:${node.id}>`}
          title={node.name}
          src={node.src}
          key={state.key}
        />
      )
    }
  },
  text: {
    ...markdown.defaultRules.text,
    parse(capture, recurseParse, state) {
      return state.nested
        ? {
          content: capture[0]
        }
        : recurseParse(parseEmojis(capture[0]), {
          ...state,
          nested: true
        })
    }
  },
  s: {
    order: markdown.defaultRules.u.order,
    match: markdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
    parse: markdown.defaultRules.u.parse,
    react(node, recurseOutput, state) {
      return <s key={state.key}>{recurseOutput(node.content, state)}</s>
    }
  }
}

const maskedLinks = {
  link: {
    ...markdown.defaultRules.link,
    react: base.link.react
  }
}

const multiline = {
  codeBlock: {
    order: markdown.defaultRules.codeBlock.order,
    match(source) {
      return /^```(([A-z0-9-]+?)\n+)?\n*([^]+?)\n*```/.exec(source)
    },
    parse(capture) {
      return { lang: (capture[2] || '').trim(), content: capture[3] || '' }
    },
    react(node, recurseOutput, state) {
      if (node.lang && hljs.getLanguage(node.lang) != null) {
        const highlightedBlock = hljs.highlight(node.lang, node.content, true)
        const html = highlightedBlock.value.replace(
          /<[\w-_]+\s+([\w-_]+\s*=\s*('[^']*'|"[^"]*")\s+)*class="([\w-_]+)"(\s+\w+\s*=\s*('[^']*'|"[^"]*"))*>/gm,
          (...match) => match[0]
        )
        return (
          <pre key={state.key}>
            <code
              className={cn('hljs', st[highlightedBlock.language], 'css')}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </pre>
        )
      }

      return (
        <pre key={state.key}>
          <code className={st.hljs}>{node.content}</code>
        </pre>
      )
    }
  },
  br: markdown.defaultRules.br
}

export const markdownRules = {
  title: base,
  embed: {...base, ...maskedLinks, ...multiline},
  msg: {...base, ...multiline},
  emoji: {emoji: base.emoji, discordEmoji: base.discordEmoji, nameEmoji: base.nameEmoji, text: base.text}
}