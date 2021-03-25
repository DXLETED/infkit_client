export const throttle = (fn, ms) => {
  let isThrottled = false,
      savedArgs,
      savedThis
  function wr () {
    if (isThrottled) {
      savedArgs = arguments
      savedThis = this
      return
    }
    fn.apply(this, arguments)
    isThrottled = true
    setTimeout(() => {
      isThrottled = false
      if (savedArgs) {
        wr.apply(savedThis)
        savedArgs = savedThis = null
      }
    }, ms)
  }
  return wr
}