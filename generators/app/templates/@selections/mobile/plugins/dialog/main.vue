<template>
  <div class="cb-dialog">
    <div class="cb-dialog-wrapper">
      <transition name="cb-dialog-fade">
        <div class="dialog" v-show="active">
          <!-- body -->
          <div class="dialog-body">
            {{ message }}
          </div>
          <!-- foot -->
          <hr>
          <div class="dialog-foot">
            <div v-if="cancel" class="cancel" @click="_handleCancel">{{ cancel }}</div>
            <div class="hairLine"></div>
            <div class="ok" @click="_handleOk">{{ ok }}</div>
          </div>
        </div>
      </transition>
    </div>
    <!-- mask -->
    <transition name="cb-dialog-mask-fade">
      <div class="cb-dialog-mask" v-show="active"></div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._show()
    }, 0)
  },
  beforeDestroy() {
    this._removeSelf()
  },
  methods: {
    /**
     * 创建遮罩层
     */
    _show() {
      this.active = true
    },
    _close() {
      this.active = false
      setTimeout(() => {
        this._removeSelf()
      }, 200)
    },
    _handleCancel() {
      this._close()
      // close回调
      this.handleCancel && this.handleCancel()
    },
    _handleOk() {
      this._close()
      // ok回调
      this.handleOk && this.handleOk()
    },
    /**
     * 移除自身
     */
    _removeSelf() {
      document.body.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss">
.cb-dialog {
  &-wrapper {
    position: fixed;
    z-index: 3333;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .dialog {
      position: relative;
      width: 630px;
      height: 260px;
      background: #fff;
      border-radius: 10px;
      box-sizing: border-box;
      overflow: hidden;
      .dialog-body {
        height: 170px;
        padding: 50px 30px 0;
        font-size: 14PX;
        line-height: 1.5;
        text-align: left;
        color: #333;
        word-wrap: break-word;
        box-sizing: border-box;
      }
      .dialog-foot {
        text-align: center;
        display: flex;
        flex-direction: row;
        .cancel, .ok {
          flex: 1;
          height: 90px;
          line-height: 90px;
          font-size: 15PX;
          font-weight: 500;
          color: #006cff;
          text-align: center;
        }
        .hairLine {
          height: 90px;
        }
      }
    }
  }
  &-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .6;
    background: rgb(41, 41, 51);
    z-index: 2222;
  }
  // 动画
  .cb-dialog-fade-enter-active,
  .cb-dialog-fade-leave-active {
    transition: all .2s;
  }
  .cb-dialog-fade-enter,
  .cb-dialog-fade-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
  .cb-dialog-mask-fade-enter-active,
  .cb-dialog-mask-fade-leave-active {
    transition: opacity .2s;
  }
  .cb-dialog-mask-fade-enter,
  .cb-dialog-mask-fade-leave-to {
    opacity: 0;
  }
}
</style>

