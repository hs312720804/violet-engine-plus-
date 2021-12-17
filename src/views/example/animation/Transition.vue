<template>
  <div style="height:calc(100vh - 170px);">
    <div class="box-wrapper">
      <transition :enter-active-class="`animated${transitionduration} ${nowTransition}`" :duration="transitionduration">
        <div v-if="boxIndex === 1" key="box-1" class="box">
          <el-image class="box-content" src="https://beta-res-fusionmedia.skysrt.com/material/20201214/1607943075199.jpg"></el-image>
        </div>
        <div v-else-if="boxIndex === 2" key="box-2" class="box">
          <iframe class="box-content" src="https://css3test.com/"></iframe>
        </div>
        <div v-else-if="boxIndex === 3" key="box-3" class="box">
          <video
            class="box-content"
            controls
            src="https://beta-res-fusionmedia.skysrt.com/material/20201214/1607943575462.mp4"
          ></video>
        </div>
        <div v-else-if="boxIndex === 4" key="box-4" class="box">
          <video
            class="box-content"
            controls
            poster="https://beta-res-fusionmedia.skysrt.com/material/20211015/5069c15b-38fb-40f4-aead-c1df285cc03d.jpg"
            src="https://beta-res-fusionmedia.skysrt.com/material/20210917/23e29b04-0952-4e03-9825-c0c96cf40832.wav"
          ></video>
        </div>
        <div v-else-if="boxIndex === 5" key="box-5" class="box">
          <el-image class="box-content" src="https://beta-res-fusionmedia.skysrt.com/material/20201222/1608628726989.jpg"></el-image>
        </div>
      </transition>
    </div>
    <div class="box-opt">{{ boxIndex }}/{{ boxNum }}</div>
    <el-form class="box-opt" inline>
      <el-form-item :label="`特效名称(${transitionList.length}种)`">
        <el-select v-model="nowTransition">
          <el-option
            v-for="transition in transitionList"
            :key="transition"
            :value="transition"
            :label="transition"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="过渡时长">
        <el-select v-model="transitionduration">
          <el-option
            v-for="duration in transitiondurationList"
            :key="duration"
            :value="duration"
            :label="duration"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handlePageChange(-1)">上一张</el-button>
        <el-button type="primary" @click="handlePageChange(1)">下一张</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'TransitionAnimation',
  data () {
    return {
      boxIndex: 1,
      boxNum: 5,
      transitionList: ['rubberBand', 'bounceInRight', 'rotateInDownLeft', 'wobble', 'shake', 'tada', 'changeBig', 'fadeInLeft', 'fadeInRight', 'fadeInDown', 'fadeInUp', 'insertDown', 'insertUp', 'insertLeft', 'insertRight', 'wipeDown', 'wipeTop', 'wipeLeft', 'wipeRight', 'doorVerticalClose', 'doorVerticalOpen', 'doorHorizontalClose', 'doorHorizontalOpen', 'spokeOne', 'ellipseOpen', 'rhombusOpen', 'plusOpen', 'horizontalBlinds', 'verticalBlinds', 'rectOpen', 'rectClose'],
      nowTransition: 'fadeInRight',
      transitiondurationList: [1000, 2000, 3000, 4000, 5000, 6000],
      transitionduration: 2000
    }
  },
  methods: {
    handlePageChange (i) {
      let index = this.boxIndex
      index += i
      if (index <= 0) {
        index = this.boxNum
      } else if (index > this.boxNum) {
        index = 1
      }
      this.boxIndex = index
    }
  }
}
</script>
<style lang="stylus" scoped>
.box-wrapper
  width 100%
  height 500px
  position relative
  overflow hidden
  .box
    background #fff
    position absolute
    width 100%
    height 100%
    .box-content
      width 100%
      height 100%
.box-opt
  text-align center
  margin 10px
</style>
