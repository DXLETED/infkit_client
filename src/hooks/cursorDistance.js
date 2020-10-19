import { useEffect, useRef, useState } from "react"

export const cursorDistance = (ref, distance) => {
  const [near, setNear] = useState(false)
	let nearRef = useRef(false)
	let mousePos = useRef()
	const mouseDistanceFromElement = () => {
		let $n = ref.current,
			mX = mousePos.current.x,
			mY = mousePos.current.y,
			from = { x: mX, y: mY },
			off = $n.getBoundingClientRect(),
			ny1 = off.top + document.body.scrollTop,
			ny2 = ny1 + $n.offsetHeight,
			nx1 = off.left + document.body.scrollLeft,
			nx2 = nx1 + $n.offsetWidth,
			maxX1 = Math.max(mX, nx1),
			minX2 = Math.min(mX, nx2),
			maxY1 = Math.max(mY, ny1),
			minY2 = Math.min(mY, ny2),
			intersectX = minX2 >= maxX1,
			intersectY = minY2 >= maxY1,
			to = {
				x: intersectX ? mX : nx2 < mX ? nx2 : nx1,
				y: intersectY ? mY : ny2 < mY ? ny2 : ny1
			},
			distX = to.x - from.x,
			distY = to.y - from.y,
			hypot = (distX ** 2 + distY ** 2) ** (1 / 2)
		return Math.floor(hypot)
	}
	const update = () => {
    if (ref.current && mousePos.current) {
      let dist = mouseDistanceFromElement()
      if (dist <= distance) {
        !nearRef.current && setNear(true)
      } else {
        nearRef.current && setNear(false)
      }
    }
	}
  const mouseMove = e => {
		mousePos.current = { x: e.pageX, y: e.pageY }
		update()
  }
  useEffect(() => {
    nearRef.current = near
  }, [near])
  useEffect(() => {
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('scroll', update, true)
    document.addEventListener('resize', update)
    return () => {
			document.removeEventListener('mousemove', mouseMove)
			document.removeEventListener('scroll', update, true)
			document.removeEventListener('resize', update)
		}
  }, [])
  return near
}