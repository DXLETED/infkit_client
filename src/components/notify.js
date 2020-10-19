import { store } from "../store"
import { generateId } from "../utils/generateId"

const newNotify = (type, {title, text, description, options}, duration) => {
  let id = generateId(store.getState().ntfs.map(ntf => ntf.id))
  store.dispatch({type: 'NEW_NOTIFY', data: {id, type, title, text, description, options, duration}})
}

export const notify = {
  info: (args, duration) => newNotify('info', args, duration),
  success: (args, duration) => newNotify('success', args, duration),
  warn: (args, duration) => newNotify('warn', args, duration),
  error: (args, duration) => newNotify('error', args, duration),
  question: (args, duration) => newNotify('question', args, duration),
  yesno: (args, duration, ans = []) => newNotify('question', {...args, options: [['Yes', ans[0]], ['No', ans[1]]]}, duration)
}