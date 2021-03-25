import React, { isValidElement } from 'react'
import cn from 'classnames'
import _ from 'lodash'
import { MLabel } from './mlabel'
import { vh } from './cssVar'

export const EditableList = props => {
  return <div className={cn('editable-list-wr', props.className, {extended: props.extended, cpointer: props.cpointer, m: props.m, m2: props.m2, hl: props.hl, nobg: props.nobg})}>
    {!props.hiddenLimit && <MLabel d={props.label} r={props.limit && `${props.data.length} / ${props.limit}`} bg />}
    <div className="editable-list">
      {props.data.map((el, i) => <div className="editable-list-el-wr" key={i}>
        {isValidElement(el)
          ? <>
              <div className={cn(`editable-list-el-${props.column ? 'column' : 'row'}`, {fixed: props.fixed})} style={{padding: props.p && vh(props.p)}}>{el}</div>
              <div className="delete" onClick={() => props.delete && props.delete(i)}><img src="/static/img/delete.png" /></div>
            </>
          : <>
              <div className={cn(`editable-list-el-${props.column ? 'column' : 'row'}`, {fixed: props.fixed})} style={{padding: props.p && vh(props.p)}} onClick={e => el.click && el.click(e)}>{el.el}</div>
              {!el.fixed && <div className="delete" onClick={() => !el.fixed && props.delete(i)}><img src={el.img || (!el.fixed ? '/static/img/delete.png' : '')} /></div>}
            </>}
      </div>)}
      {!props.data.length && props.empty && <div className="editable-list-el-wr">{props.empty}</div>}
      {!props.noAdd && (props.limit === undefined || props.data.length < props.limit) &&
        <div className="add" onClick={props.add}><img src="/static/img/add.png" style={props.addLabel && {marginRight: '1vh'}} />{props.addLabel}</div>}
    </div>
  </div>
}