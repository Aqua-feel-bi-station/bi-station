import Vue from 'vue'

Vue.prototype.$notify = (message, timeout = 3000) => {
  Vue.prototype.$dialog.notify.info(message, {
    position: 'top-right',
    timeout
  })
}

Vue.prototype.$errorNotify = (message) => {
  message = message || '通信エラーが発生しました。\nリロード後、もう一度送信してください。'
  Vue.prototype.$dialog.error({
    text: message,
    title: '通信エラー',
    actions: [{
      text: '閉じる'
    }]
  })
}
