import { observable, action, autorun, reaction, toJS } from 'mobx'

let localStorageSync = ['a']

class Guild {
  @observable d = null
  @action upd = n => {
    this.d = n
  }
}

class Store {
  constructor() {
    localStorageSync.map(key => {
      try {
        this[key] = JSON.parse(localStorage.getItem(key))
      } catch (e) {
        localStorage.removeItem(key)
      }
      reaction(() => this[key], l => localStorage.setItem(key, JSON.stringify(l)))
    })
  }
  guild = new Guild
  @observable a = 0
  @observable b = 0
  @action add = () => {
    this.a ++
  }
  save(json) {
    alert(json)
  }
}

let store = new Store

export default store
console.log(toJS(store.guild.d))