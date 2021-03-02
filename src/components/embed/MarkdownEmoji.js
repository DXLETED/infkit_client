import React from 'react'
import markdown from 'simple-markdown'
import { markdownRules } from './markdownRules'

import st from './MarkdownEmoji.sass'

const rules = markdownRules.emoji
console.log(rules)

export const MarkdownEmoji = ({str}) => {
  const parsed = markdown.parserFor(rules)(str)
  const reactOutput = markdown.reactFor(markdown.ruleOutput(rules, 'react'))
  return <div className={st.markdown}>{reactOutput(parsed)}</div>
}