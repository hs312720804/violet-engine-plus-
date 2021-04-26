<template>
  <div>
    <h2>简单上传</h2>
    <c-upload
      ref="upload"
      :multiple="true"
      :min-height="100"
      :max-height="200"
      @upload="handleUpload"
    >
      <!-- slot="preview" slot-scope="{fileList}" -->
      <template #preview="{fileList}" class="upload-pic-list">
        <div class="upload-pic-list__add" @click="$refs.upload.handleSelectFile()">
          <i class="el-icon el-icon-plus"></i>
        </div>
        <div v-for="file in fileList" :key="file.id" class="upload-pic-list__item">
          <div
            v-if="file.status === 'error'"
            class="upload-pic-list__error"
          >
            上传失败: {{ file.message }}
          </div>
          <div v-if="file.status === 'uploading'" class="upload-pic-list__progress">
            <el-progress :width="100" type="circle" :percentage="file.percentage"></el-progress>
          </div>
          <img v-else :src="file.dataUrl">
          <i
            v-if="file.status !== 'uploading'"
            class="upload-pic-list__remove el-icon el-icon-close"
            title="移除"
            @click="$refs.upload.handleRemove(file)"
          ></i>
        </div>
      </template>
    </c-upload>
  </div>
</template>

<script>
export default {
  methods: {
    handleUpload (file, fileListItem) {
      function update () {
        if (fileListItem.percentage < 100) {
          fileListItem.percentage += 10
        } else {
          fileListItem.status = 'successs'
          clearInterval(fileListItem.interval)
        }
      }
      fileListItem.interval = setInterval(update, 200)
    }
  }
}
</script>
<style lang="stylus" scoped>
$height = 100px;
$width = 100px;

.upload-pic-list__progress {
  position: absolute;
}

.upload-pic-list__add, .upload-pic-list__item {
  height: $height;
  width: $width;
  margin-right: 10px;
  display: inline-block;
  vertical-align: top;
  border: 1px solid #ccc;
}

.upload-pic-list__add {
  cursor: pointer;

  i {
    position: relative;
    top: 50%;
    margin: -10px auto;
    display: block;
    font-size: 20px;
    text-align: center;
  }
}

.upload-pic-list__item {
  position: relative;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.upload-pic-list__error {
  position: absolute;
  background: #000;
  opacity: 0.7;
  color: #fff;
  width: 100%;
  font-size: 12px;
  padding: 5px;
  display: block;
  box-sizing: border-box;
}

.upload-pic-list__remove {
  position: absolute;
  color: red;
  cursor: pointer;
  top: 0;
  right: 0;
}
</style>
