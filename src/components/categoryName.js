import React from 'react'

export const CategoryName = props => {
  return <div className="category-name-wr">
    <div className="border" />
    <div className="category-name"><span>{props.children}</span></div>
  </div>
}