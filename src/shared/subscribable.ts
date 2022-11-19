import { isFn } from './types'

const UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL')

export interface ISubscriber<Payload = any> {
  (payload: Payload): void | boolean
}

export class Subscribable<ExtendsType = any> {
  private subscribers: {
    index?: number
    [key: number]: ISubscriber
  } = {
      index: 0,
    }

  dispatch<T extends ExtendsType = any>(event: T, context?: any) {
    let interrupted = false
    for (const key in this.subscribers) {
      if (isFn(this.subscribers[key])) {
        (event as any)['context'] = context
        if (this.subscribers[key](event) === false) {
          interrupted = true
        }
      }
    }
    return interrupted ? false : true
  }

  subscribe(subscriber: ISubscriber) {
    //Water.Li添加赋值
    let id: number = 0
    if (isFn(subscriber)) {
      if (!this.subscribers.index) {
        this.subscribers.index = 0
      }
      id = this.subscribers.index + 1
      this.subscribers[id] = subscriber
      this.subscribers.index++
    }

    const unsubscribe = () => {
      this.unsubscribe(id)
    }

    (unsubscribe as any)[UNSUBSCRIBE_ID_SYMBOL] = id

    return unsubscribe
  }

  unsubscribe = (id?: number | string | (() => void)) => {
    if (id === undefined || id === null) {
      for (const key in this.subscribers) {
        this.unsubscribe(key)
      }
      return
    }
    if (!isFn(id)) {
      delete this.subscribers[id as any]
    } else {
      delete this.subscribers[(id as any)[UNSUBSCRIBE_ID_SYMBOL]]
    }
  }
}
