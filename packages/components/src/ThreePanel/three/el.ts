export interface ElRect {
  width: number
  height: number
  left: number
  top: number
  right: number
  bottom: number
  x: number
  y: number
}
export class El {
  public el: HTMLElement = document.body
  constructor(element?: HTMLElement | null) {
    if (element) {
      this.el = element
    }
  }
  setEl(el: HTMLElement) {
    this.el = el
  }
  getEl() {
    return this.el
  }
  size(): ElRect {
    if (this.el) {
      return this.el.getBoundingClientRect()
    }
    return {
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
    }
  }
}
