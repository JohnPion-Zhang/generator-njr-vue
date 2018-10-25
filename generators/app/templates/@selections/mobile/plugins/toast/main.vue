<template>
  <div class="cb-toast">
    <transition name="cb-toast-fade">
      <div
        class="toast"
        v-show="visiable"
        @mouseenter="_clearTimer"
        @mouseleave="_startTimer"
      >
        <!-- body -->
        <div class="body">
          <slot>{{ message }}</slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'cbToast',
  data() {
    return {
      visiable: false,
      duration: 3000,
      message: ''
    }
  },
  mounted() {
    setTimeout(() => {
      this.visiable = true
    }, 0)
    this._startTimer()
  },
  methods: {
    _clearTimer() {
      clearTimeout(this.timer)
    },
    _startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.visiable = false
          // 为了动画更自然，加个延时
          setTimeout(() => {
            this._destroyElement()
          }, 200)
        }, this.duration)
      }
    },
    _destroyElement() {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
  }
}
</script>

<style lang="scss">
.cb-toast {
  .toast {
    position: fixed;
    z-index: 4444;
    display: inline-block;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 160px;
    max-width: 680px;
    border-radius: 8px;
    text-align: center;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, .7);
    font-size: 17PX;
    word-wrap: break-word;
    color: #fff;
    .body {
      padding: 22px;
      line-height: 1.2;
    }
  }
  // 动画
  .cb-toast-fade-enter-active,
  .cb-toast-fade-leave-active {
    transition: all 0.2s;
  }
  .cb-toast-fade-enter,
  .cb-toast-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
}
</style>