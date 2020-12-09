// 可拖拽方向: 横向拖拽, 纵向拖拽
interface DraggerOptions {
  /** 拖动方向, all表示所有方向, x表示横坐标方向, y表示纵坐标方向 */
  direction?: 'all' | 'x' | 'y'
  rangeX?: [number, number]
  rangeY?: [number, number]
}

export class Dragger {
  /** 被拖动的元素 */
  private el: HTMLElement

  /** 拖动方向 */
  private direction: 'all' | 'x' | 'y' = 'all'

  /** 初始位移x坐标 */
  private originX = 0

  /** 初始位移y坐标 */
  private originY = 0

  /** 位移的x坐标 */
  x = 0

  /** 位移的y坐标 */
  y = 0

  /** x轴运动范围 */
  private rangeX: [number, number] = [-10000, 10000]

  /** y轴运动范围 */
  private rangeY: [number, number] = [-10000, 10000]

  /** 停止时的回调 */
  private mouseupQueue: ((x: number, y: number) => void)[] = []

  /** 移动时的回调 */
  private mousemoveQueue: ((x: number, y: number) => void)[] = []

  constructor(el: HTMLElement, options?: DraggerOptions) {
    this.el = el

    if (options) {
      options.direction && (this.direction = options.direction)
      options.rangeX && (this.rangeX = options.rangeX)
      options.rangeY && (this.rangeY = options.rangeY)
    }
  }

  /** 鼠标按下 */
  private mousedown = (ev: MouseEvent) => {
    this.originX = ev.pageX
    this.originY = ev.pageY

    document.addEventListener('mousemove', this.getMoveHandler())
    document.addEventListener('mouseup', this.mouseup)
  }

  private getMoveHandler() {
    let moveHandler

    switch (this.direction) {
      case 'all':
        moveHandler = this.mousemove
        break
      case 'x':
        moveHandler = this.xMousemove
        break
      case 'y':
        moveHandler = this.yMousemove
        break
      default:
        moveHandler = this.mousemove
    }
    return moveHandler
  }

  private transform(x = 0, y = 0) {
    this.el.style.transform = `translate(${x}px, ${y}px)`
  }

  /** x轴y轴移动 */
  private mousemove = (ev: MouseEvent) => {
    let [xMin, xMax] = this.rangeX
    let [yMin, yMax] = this.rangeY

    let disX = this.x + ev.pageX - this.originX,
      disY = this.y + ev.pageY - this.originY

    if (disX < xMin || disX > xMax) {
      disX = disX < xMin ? xMin : xMax
    }
    if (disY < yMin || disY > yMax) {
      disY = disY < yMin ? yMin : yMax
    }
    this.mousemoveQueue.forEach((cb) => {
      cb(disX, disY)
    })
    this.transform(disX, disY)
  }

  /** x轴移动 */
  private xMousemove = (ev: MouseEvent) => {
    let [xMin, xMax] = this.rangeX
    let disX = this.x + ev.pageX - this.originX

    if (disX < xMin || disX > xMax) {
      disX = disX < xMin ? xMin : xMax
    }
    this.mousemoveQueue.forEach((cb) => {
      cb(disX, 0)
    })
    this.transform(disX)
  }

  /** y轴移动 */
  private yMousemove = (ev: MouseEvent) => {
    let [yMin, yMax] = this.rangeY
    let disY = this.y + ev.pageY - this.originY
    if (disY < yMin || disY > yMax) {
      disY = disY < yMin ? yMin : yMax
    }
    this.mousemoveQueue.forEach((cb) => {
      cb(0, disY)
    })
    this.transform(disY)
  }

  /** 鼠标松开 */
  private mouseup = (ev: MouseEvent) => {
    let disX = this.x + ev.pageX - this.originX,
      disY = this.y + ev.pageY - this.originY

    this.x = disX < this.rangeX[0] ? this.rangeX[0] : disX > this.rangeX[1] ? this.rangeX[1] : disX
    this.y = disY < this.rangeY[0] ? this.rangeY[0] : disY > this.rangeY[1] ? this.rangeY[1] : disY

    this.mouseupQueue.forEach((cb) => {
      cb(this.x, this.y)
    })

    document.removeEventListener('mousemove', this.getMoveHandler())
    document.removeEventListener('mouseup', this.mouseup)
  }

  reset() {
    this.originX = 0
    this.originY = 0
    this.x = 0
    this.y = 0
    this.transform(0, 0)
  }

  /** 开启拖动 */
  open() {
    if (!this.el) return
    this.el.addEventListener('mousedown', this.mousedown)
  }

  /** 关闭拖动 */
  close() {
    if (!this.el) return
    this.el.removeEventListener('mousedown', this.mousedown)
  }

  listen(type: 'end' | 'moving', callback: (x: number, y: number) => void) {
    if (type === 'end') {
      this.mouseupQueue.push(callback)
    } else if (type === 'moving') {
      this.mousemoveQueue.push(callback)
    }
  }
}
