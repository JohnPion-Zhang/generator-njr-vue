import FastClick from 'fastclick'

// fastclick初始化
FastClick.attach(document.body)

// fix [Intervention] Unable to preventDefault inside passive event listener due to target being treated as passive.
document.body.style.touchAction = 'manipulation'