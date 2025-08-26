export function gradientColor(startColorHex: string, endColorHex: string, step: number): Array<string> {
  const startRGB = hex2rgb(startColorHex)
  const startR = startRGB[0]
  const startG = startRGB[1]
  const startB = startRGB[2]

  const endRGB = hex2rgb(endColorHex)
  const endR = endRGB[0]
  const endG = endRGB[1]
  const endB = endRGB[2]

  const sR = (endR - startR) / step
  const sG = (endG - startG) / step
  const sB = (endB - startB) / step

  const colorArr = Array<string>()
  for (let i = 0; i < step; i++) {
    const color_ = `rgba(${Math.floor(sR * i + startR)},${Math.floor(sG * i + startG)},${Math.floor(sB * i + startB)},1)`
    colorArr.push(color_)
  }
  return colorArr
}

/**
 * translate hex color to rgb color array
 */
export function hex2rgb(sColor: string): Array<number> {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  sColor = sColor.toLowerCase()
  const sColorChange = Array<number>()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = "#"
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    //处理六位的颜色值
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)))
    }
  }
  return sColorChange
}

/**
 * tranlate rgb color to hex string
 */
export function rgb2Hex(rgb: string): string {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  let res_ = ""
  if (/^(rgb|RGB)/.test(rgb)) {
    const aColor = rgb.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",")
    let strHex = "#"
    for (let i = 0; i < aColor.length; i++) {
      let hex = parseInt(aColor[i]).toString(16)
      hex = parseInt(hex) < 10 ? "0" + hex : hex
      if (hex === "0") {
        hex += hex
      }
      strHex += hex
    }
    if (strHex.length !== 7) {
      strHex = rgb
    }
    res_ = strHex
  } else if (reg.test(rgb)) {
    const aNum = rgb.replace(/#/, "").split("")
    if (aNum.length === 6) {
      res_ = rgb
    } else if (aNum.length === 3) {
      let numHex = "#"
      for (let i = 0; i < aNum.length; i += 1) {
        numHex += aNum[i] + aNum[i]
      }
      res_ = numHex
    }
  } else {
    res_ = rgb
  }
  return res_
}

/**
 * anger to rad
 */
export function a2r(angle: number): number {
  return angle * (Math.PI / 180)
}

/**
 * rad to anger
 */
export function r2a(radian: number): number {
  return radian * (180 / Math.PI)
}
