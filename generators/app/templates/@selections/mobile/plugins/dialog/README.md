弹窗提示 dialog
---
弹窗提示组件

### 使用
js

1. 单参数
```js
mounted() {
  this.$dialog('文字内容')
}
```

2.多参数
```js
mounted() {
  this.$dialog({
    message: '文字内容',
    cancel: '取消',
    ok: '确定',
    handleCancel: () => {
      console.log('cancel')
    },
    handleOk: () => {
      console.log('ok')
    }
  })
}
```

### Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| message | 文字内容 | string | — | '' |
| cancel | 取消按钮文案 | string | — | '' |
| ok | 确认按钮文案 | string | — | '知道了' |
| handleCancel | 取消回调 | function | — | null |
| handleOk | 确认回调 | function | — | null |