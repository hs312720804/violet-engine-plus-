<template>
  <div>
    <h2>
      请返回
      <span>首页</span>
    </h2>
    <h3>您访问的页面不存在</h3>

    <div class="container">
      <div>
        <h1>404</h1>
      </div>
      <div></div>
      <div></div>
    </div>
    <canvas id="canv"></canvas>
  </div>
</template>
<script>
export default {
  data () {
    return {
      a: '',
      b: '',
      w: '',
      h: ''
    }
  },
  methods: {
    // flicks () {
    //   for (var i = 0; i < px.length; i += 4) {
    //     var col = Math.random() * 255 + 50
    //     px[i] = col
    //     px[i + 1] = col
    //     px[i + 2] = col
    //   }
    //   ಥ_ಥ.putImageData(imgData, 0, 0)
    // },
    flicker () {
      this.a = document.getElementById('canv')
      this.b = this.a.getContext('2d')
      this.a.width = this.w = 700
      this.a.height = this.h = 500
      this.b.fillStyle = 'hsla(255,255%,255%,1)'
      // this.b.fillRect(0, 0, w, h)
      // this.b.fill()
      // imgData = this.b.getImageData(0, 0, w, h)
      // px = imgData.data
      // flickInt = setInterval(this.flicks, 30)
    },

    bgeffect () {
      var ب_ب
      var ಥ_ಥ
      var imgData
      var px
      var w
      var h
      var flickInt

      return {
        init: this.flicker()
      }
    }
  },
  created () {
    this.bgeffect().init()
  }
}
</script>
<style lang="stylus" scoped>
</style>
