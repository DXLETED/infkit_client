import Axios from "axios"
import { useState, useRef } from "react"

export const useDelayedRequest = (set, delay) => {
  const timeout = useRef()
  const run = req => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => Axios(req)
      .then(r => {
        console.log(r.status, r.data)
        if (r.status === 200)
          set(req, r.data)
      }), delay)
  }
  const cancel = () => clearTimeout(timeout.current)
  return [run, cancel]
}