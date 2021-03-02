import React from 'react'
import cn from 'classnames'

import st from './Text.sass'

export const Text = ({bold, jcc, disabled, children}) => <div className={cn(st.text, {[st.bold]: bold, [st.jcc]: jcc, disabled})}>{children}</div>