export const storeSync = (store, list) => {
  list.map(el => {
    let lsItem
    if (!localStorage.getItem(el))
      lsItem = {}
    else {
      try {
        lsItem = JSON.parse(localStorage.getItem(el))
      } catch {
        lsItem = {}
      }
    }
    store.dispatch({
      type: 'SET',
      data: {[el]: lsItem}
    })
    store.subscribe(() => {
      if (localStorage.getItem(el) !== store.getState()[el])
        localStorage.setItem(el, JSON.stringify(store.getState()[el]))
    })
  })
  window.addEventListener('storage', e => {
    list.includes(e.key) && store.dispatch({type: 'SET', data: {[e.key]: JSON.parse(e.newValue)}})
  })
}