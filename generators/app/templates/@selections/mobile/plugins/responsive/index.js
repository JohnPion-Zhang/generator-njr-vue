// rem 配置
const win = window
const doc = win.document
const baseWidth = 750
const documentHTML = doc.documentElement
let pixelRatio = 2
// 让页面有最大宽度
document.body.style.maxWidth = `${baseWidth}px`
document.body.style.margin = '0 auto'

/**
 * 设置html根字体大小
 */
function setRootFont() {
  const docWidth = documentHTML.getBoundingClientRect().width
  const scale = docWidth / baseWidth
  if (docWidth >= 750) {
    documentHTML.style.fontSize = '100px'
  } else {
    documentHTML.style.fontSize = `${scale * 100}px`
  }
  pixelRatio = window.devicePixelRatio
  documentHTML.setAttribute('data-dpr', pixelRatio)
  documentHTML.setAttribute('data-font-size', scale * 100)
}

setRootFont()
win.addEventListener('resize', setRootFont, false)