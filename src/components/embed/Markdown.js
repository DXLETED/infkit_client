import React from 'react'
import markdown from 'simple-markdown'
import cn from 'classnames'
import './Markdown.sass'
import { markdownRules } from './markdownRules'

import st from './Markdown.sass'

export const Markdown = ({str, mode, inline}) => {
  let rules
  switch (mode) {
    case 'title': rules = markdownRules.title
      break
    case 'embed': rules = markdownRules.embed
      break
    default: rules = markdownRules.msg
  }
  const parsed = markdown.parserFor(rules)(mode === 'title' ? str.replace(/\n/g, ' ') : str)
  const reactOutput = markdown.reactFor(markdown.ruleOutput(rules, 'react'))
  return <div className={cn(st.markdown, {[st.inline]: inline})}>{reactOutput(parsed)}</div>
}