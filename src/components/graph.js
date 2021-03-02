import React, { useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import { convertHexToRGBA } from '../utils/convertHexToRGBA'
import { colors } from './colorlist'
import Color from 'color'
import { Tip } from './Tip'

export const Graph = props => {
  let dataset = props.dataset
  let labels = props.labels || null
  const [width, setWidth] = useState(props.width)
  const [updating, setUpdating] = useState(false)
  let strokeWidth = props.strokeWidth || 2
  let labelsWidth = props.labelsWidth || '4vh'
  let margin = props.margin !== undefined ? props.margin : 0.2
  let highlight = props.highlight === false ? false : true
  let color = props.color || colors.blue
  let fill = props.fill || convertHexToRGBA(color, 0.2)
  let maxValue = props.max !== undefined ? props.max : Math.max.apply(null, dataset)
  let minValue = props.min !== undefined ? props.min : Math.min.apply(null, dataset)
  let diff = maxValue - minValue
  let scale = diff / 100
  let mainRef = useRef()
  let type = props.type || 'svg'
  const updateWidth = () => {
    setWidth(0)
    setTimeout(() => setUpdating(true))
  }
  useEffect(() => {
    if (!width) {
      updateWidth()
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }
  }, [])
  useEffect(() => {
    if (mainRef.current && updating) {
      setWidth(mainRef.current.clientWidth / mainRef.current.clientHeight * 100 / (dataset.length - 1))
      setUpdating(false)
    }
  }, [updating])
  return (
    <div id={props.id} className={classnames('graph', props.className, type)}>
      {type === 'svg' && <svg className="graph-svg" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width * (dataset.length - 1) || 0} 100`} ref={mainRef}>
        {width && labels && Object.values(labels).map((d, i) => {
          let pos = diff / scale * margin + (maxValue - d.pos) / scale * (1 - margin * 2)
          return pos >= 0 && pos <= 100 && <line x1="0" y1={pos} x2={width * dataset.length} y2={pos} stroke={convertHexToRGBA(d.color, 0.5)} strokeWidth={strokeWidth} strokeDasharray="2,1" key={i} />
        })}
        {width && dataset.map((d, i) => {
          if (i === 0) return
          let pos1 = diff / scale * margin + (maxValue - dataset[i - 1]) / scale * (1 - margin * 2)
          let pos2 = diff / scale * margin + (maxValue - d) / scale * (1 - margin * 2)
          let posX1 = (i - 1) * width
          let posX2 = i * width
          return (
            <React.Fragment key={i}>
              <polygon points={`${posX1},100 ${posX1},${pos1} ${posX2},${pos2} ${posX2},100`} fill={fill} />
              <line x1={posX1} y1={pos1} x2={posX2} y2={pos2} stroke={color} strokeLinecap="round" strokeWidth={strokeWidth} />
            </React.Fragment>
          )
        })}
      </svg>}
      {type === 'css' && <div className="graph-css with-scroll">
        {labels && labels.map(([_, d], i) => {
          let pos = diff / scale * margin + (d.pos - minValue) / scale * (1 - margin * 2) || 0
          if (maxValue === minValue && minValue !== 0)
            pos = 50
          return pos >= 0 && pos <= 100 && <div className="graph-css-label" style={{top: `${100 - pos}%`, borderColor: Color(d.color).alpha(0.5).string()}} key={i} />
        })}
        {dataset.map((d, i) => {
          let pos = diff / scale * margin + (d - minValue) / scale * (1 - margin * 2) || 0
          if (maxValue === minValue && minValue !== 0)
            pos = 50
          return (
            <div className="graph-css-chunk" key={i} ref={mainRef}>
              <div className="graph-css-chunk-data" style={{height: pos + '%', background: color, animationDelay: `${(props.delay || 0) + i * 20}ms`}}></div>
            </div>
          )
        })}
      </div>}
      {labels && 
        <div className="labels" style={{width: `calc(${labelsWidth})`}}>
          {labels.map(([label, d], i) => {
            let pos = diff / scale * margin + (d.pos - minValue) / scale * (1 - margin * 2) || 0
            if (maxValue === minValue && minValue !== 0)
              pos = 50
            return pos >= 0 && pos <= 100 && <div className="graph-label" style={{top: `${100 - pos}%`, color: Color(d.color).alpha(1).string()}} key={i}>{label}</div>
          })}
        </div>
      }
      {highlight && <div className="highlight" style={{width: labels ? `calc(100% - ${labelsWidth})` : '100%'}}>
        {dataset.map((d, i) => <div className="chunk" key={i}>
          {props.tips?.[i]}
        </div>)}
      </div>}
      {props.alert && <div className="graph__alert">{props.alert}</div>}
    </div>
  )
} 