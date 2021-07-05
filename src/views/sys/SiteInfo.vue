<template>
  <div class="page-code--child">
    <c-card
      :title="title"
      class="c-normal"
      @go-back="$emit('go-back')"
    >
      <div slot="actions"></div>
      <c-form
        ref="form"
        label-width="90px"
        :model="form"
        :rules="rules"
        :readonly="isReadonly"
      >
        <div v-for="(item, key) in fields" :key="key">
          <c-form-string
            v-if="item.inputType === 'string' || !item.inputType"
            :key="key"
            v-model="form[item.prop]"
            :label="item.label"
            :placeholder="'请填写' + item.label"
            :rules="rules[item.prop]"
            :prop="item.prop"
            class="el-item-width"
          ></c-form-string>
          <c-form-enum
            v-if="item.inputType === 'enum'"
            :key="key"
            v-model="form[item.prop]"
            :label="item.label"
            type="radio"
            :prop="item.prop"
            :rules="rules.noEmpty"
            :options="item.options"
          ></c-form-enum>
          <el-form-item
            v-if="item.inputType === 'date'"
            :label="item.label"
          >
            <el-date-picker
              v-model="form[item.prop]"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="item.inputType === 'layout'"
            :label="item.label"
          >
            <div
              :class="isReadonly ? 'c-layout c-layout-nopoint' : 'c-layout'"
            >
              <el-radio-group
                v-if="isReadonly"
                v-model="form.layout"
                :disabled="isReadonly"
                @change="handleLayoutSelect"
              >
                <div v-if="form.layout === 'default'">
                  <span class="c-layout-item default">
                    <p>
                      <span></span>
                      <b></b>
                    </p>
                    布局一(响应式)
                  </span>
                </div>
                <div v-if="form.layout === 'tlr'">
                  <span class="c-layout-item tlr">
                    <p>
                      <span></span>
                      <b>
                        <small></small>
                      </b>
                    </p>
                    布局二
                  </span>
                </div>
                <div v-if="form.layout === 'tb'">
                  <span class="c-layout-item tb">
                    <p>
                      <span></span>
                    </p>
                    布局三
                  </span>
                </div>
              </el-radio-group>
              <el-radio-group v-else v-model="form.layout" @change="handleLayoutSelect">
                <el-radio label="default">
                  <span class="c-layout-item default">
                    <p>
                      <span></span>
                      <b></b>
                    </p>
                    布局一(响应式)
                  </span>
                </el-radio>
                <el-radio label="tlr">
                  <span class="c-layout-item tlr">
                    <p>
                      <span></span>
                      <b>
                        <small></small>
                      </b>
                    </p>
                    布局二
                  </span>
                </el-radio>
                <el-radio label="tb">
                  <span class="c-layout-item tb">
                    <p>
                      <span></span>
                    </p>
                    布局三
                  </span>
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item
            v-if="item.inputType === 'logoUpload'"
            :label="item.label"
          >
            <div v-for="(obj, index) in form.logo" :key="index" class="c-logo">
              <div class="c-site-logo">
                <div v-if="obj.image" class="c-logo-img">
                  <img :src="obj.image" class="avatar">
                </div>
                <el-upload
                  v-if="!isReadonly"
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <el-button size="small" type="primary">{{ obj.image ? '更换' : '上传' }}</el-button>
                </el-upload>
              </div>
              <div
                class="c-logo-attr"
              >
                <div>
                  <template v-if="isReadonly">Key：{{ obj.key }}</template>
                  <el-input v-else v-model="obj.key" disabled>
                    <template #prepend>Key</template>
                  </el-input>
                </div>
                <div style="margin-left:10px">
                  <template v-if="isReadonly">
                    <div v-if="obj.width">宽：{{ obj.width }}PX</div>
                  </template>
                  <el-input v-else v-model="obj.width">
                    <template #prepend>宽</template>
                    <template #append>PX</template>
                  </el-input>
                </div>
                <div style="margin-left:10px">
                  <template v-if="isReadonly">
                    <div v-if="obj.height">高：{{ obj.height }}PX</div>
                  </template>
                  <el-input v-else v-model="obj.height">
                    <template #prepend>高</template>
                    <template #append>PX</template>
                  </el-input>
                </div>
              </div>
            </div>
            <div style="color:#8e8f92; font-size:14px; font-style:italic">说明：Logo上传，在这里是演示作用，实际应用时根据需要完善或删除。</div>
          </el-form-item>
        </div>
        <el-form-item v-if="!isReadonly">
          <el-button type="success" @click="handleCancleEdit">取消</el-button>
          <el-button type="primary" @click="saveForm()">保存</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button
            v-permission="'normal:update'"
            type="primary"
            @click="isReadonly = false"
          >
            修改
          </el-button>
        </el-form-item>
      </c-form>
    </c-card>
  </div>
</template>

<script>
export default {
  props: ['menuId'],
  data () {
    return {
      isReadonly: true,
      title: '常规设置',
      fields: [
        {
          label: '站点名称',
          prop: 'siteName'
        },
        {
          label: 'Logo',
          prop: 'logo',
          inputType: 'logoUpload'
        },
        {
          label: 'Logo宽',
          prop: 'logoWidth',
          inputType: 'other'
        },
        {
          label: 'Logo高',
          prop: 'logoHeight',
          inputType: 'other'
        },
        {
          label: '布局',
          prop: 'layout',
          inputType: 'layout'
        },
        {
          label: '版权信息',
          prop: 'copyright'
        },
        // {
        //   label: 'API前辍',
        //   prop: 'apiPrefix'
        // },
        {
          label: '关于',
          prop: 'introduction'
        },
        {
          label: '备案号',
          prop: 'recordNum'
        }
        // ,
        // {
        //   label: '百度统计Id',
        //   prop: 'tongjiId'
        // }
      ],
      form: {
        layout: ''
      },
      rules: {},
      menuDetail: {}
    }
  },
  created () {
    this.initData()
    this.fetchMenuData()
  },
  methods: {
    initData () {
      this.form = { ...this.form, ...this.$store.state.app.site }
      if (this.form.logo) {
        const logo = this.$constants.evil(this.form.logo)
        this.form.logo = Object.keys(logo).map(key => {
          return {
            key,
            image: logo[key].image,
            width: logo[key].width,
            height: logo[key].height
          }
        })
      } else {
        this.form.logo = [
          {
            key: 'login',
            image: '',
            width: '',
            height: ''
          },
          {
            key: 'top',
            image: '',
            width: '',
            height: ''
          }
        ]
      }
    },
    handleLayoutSelect (val) {
      // this.$store.dispatch('setLayout', val)
      // this.$set(this.$store.state.app, 'layout', val)
    },
    handleAvatarSuccess (res, file) {
      this.form['logo'] = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    fetchMenuData () {
      this.$service.getMenusDetail({ id: this.menuId }).then(data => {
        this.menuDetail = data
      })
    },
    handleCancleEdit () {
      this.isReadonly = true
      this.initData()
    },
    saveForm () {
      const saveDate = JSON.parse(JSON.stringify(this.form))
      delete saveDate.createdTime
      delete saveDate.updatedTime
      let logoObj = {}
      saveDate.logo.forEach((item, index) => {
        logoObj[item.key] = {
          image: item.image,
          width: item.width,
          height: item.height
        }
      })
      saveDate.logo = JSON.stringify(logoObj)
      this.$service.fetch({
        method: 'post',
        url: 'website/update',
        data: saveDate
      }).then(data => {
        this.$message.success('保存成功')
        setTimeout(() => {
          location.reload()
        }, 500)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.c-layout
  display flex
  font-size 12px
  padding-top 10px
  >>>.el-radio-group
    display flex
  >>>.el-radio
    display flex
  >>>.el-radio__label
    display block
.c-layout-item
  display block
  width 170px
.c-layout .default p
  display flex
  height 100px
  margin 0 10px 6px 0
  background #f3f3f3
  span
    width 15%
    background #bbb
    display block
  b
    width 85%
    display block
    border 1px solid #eee
.c-layout .tlr p
  height 100px
  margin 0 10px 6px 0
  background #f3f3f3
  span
    background #bbb
    display block
    height 10px
  b
    display block
    small
      display block
      width 20px
      background #ddd
      height 90px
.c-layout .tb p
  height 100px
  margin 0 10px 6px 0
  background #f3f3f3
  span
    background #bbb
    display block
    height 10px
.c-layout p
  border 1px solid #bbb
  cursor pointer
.c-layout-nopoint p
  cursor auto
.c-layout p:hover
  border-color #999 !important
>>>.avatar-uploader
  .el-upload
    cursor pointer
    position relative
    overflow hidden
.avatar {
  width: 200px
  display: block
}
.c-logo
  margin-bottom 14px
  .el-input
    width auto
.c-logo-attr
  display flex
  >>>.el-input-group__prepend, >>>.el-input-group__append
    padding 0 10px
.c-site-logo
  display flex
.c-logo-img
  padding-top 5px
  margin-right 10px
.c-normal
  height calc(100vh - 120px)
  display flex
  flex-direction column
</style>
