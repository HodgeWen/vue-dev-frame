export class KeyUpEvent {
  private queue: Record<string, Function[]> = {}

  constructor(private el: HTMLElement) {
    this.el && this.el.addEventListener('keyup', this.keyup)
  }

  private keyup = (e: KeyboardEvent) => {
    const { queue } = this

    let singleKey = e.key
    let altAndKey = `Alt+${e.key}`
    let controlKey = `Control+${e.key}`
    let shiftKey = `Shift+${e.key}`
    let each = (cb: Function) => cb(e.key)

    queue[singleKey] && queue[singleKey].forEach(each)
    e.altKey && queue[altAndKey] && queue[altAndKey].forEach(each)
    e.ctrlKey && queue[controlKey] && queue[controlKey].forEach(each)
    e.shiftKey && queue[shiftKey] && queue[shiftKey].forEach(each)
  }

  listen(keyHandlers: Record<string, Function>) {
    Object.keys(keyHandlers).forEach((key) => {
      this.queue[key]
        ? this.queue[key].push(keyHandlers[key])
        : (this.queue[key] = [keyHandlers[key]])
    })
  }

  off(key?: string | string[]) {
    if (!key) {
      this.queue = {}
    } else if (typeof key === 'string') {
      delete this.queue[key]
    } else {
      this.el && this.el.removeEventListener('keyup', this.keyup)
    }
  }
}

