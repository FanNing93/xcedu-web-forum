<template>
  <section>
    <editor
      v-model="htmlContent"
      :init="{
        height: 500,
        language: 'zh_CN',
        language_url: publicPath + 'tinymce/langs/zh_CN.js',
        skin: 'oxide',
        skin_url: publicPath + 'tinymce/skins/ui/oxide',
        content_css: publicPath + 'tinymce/skins/content/default/content.css',
        menubar: true,
        toolbar:
          'undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | \
          image',
        plugins: [
          'image'
        ],
        image_description: false,
        images_reuse_filename: true,
        images_upload_handler: fileUpLoad
      }"
      @input="editorChange"
    />
  </section>
</template>

<script>
// Import TinyMCE
import 'tinymce/tinymce'
// Default icons are required for TinyMCE 5.3 or above
import 'tinymce/icons/default'
// A theme is also required
import 'tinymce/themes/silver'
// Any plugins you want to use has to be imported
import 'tinymce/plugins/image'
import Editor from '@tinymce/tinymce-vue'

import OSS from 'ali-oss'
import { v4 as uuidv4 } from 'uuid'
let PATH = null

export default {
  components: {
    editor: Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      publicPath: process.env.WEB_PUBLIC_PATH,
      client: null,
      htmlContent: ''
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      this.htmlContent = this.value
    }
  },
  mounted () {
    this.htmlContent = this.value
  },
  methods: {
    editorChange () {
      this.$emit('input', this.htmlContent)
    },
    fileUpLoad (blobInfo, success, failure, progress) {
      if (!PATH) {
        PATH = 'tinyMCE/img/'
      }
      if (!this.client) {
        this.client = new OSS({
          region: 'oss-cn-shenzhen',
          accessKeyId: 'LTAI4G2nbEWcDi9djnDY8tvJ',
          accessKeySecret: 'ZZN02tVv7BpJEhc5bWa2NlNIdL6Vvp',
          bucket: 'gtyzfile'
        })
      }
      const id = uuidv4().replace(/-/g, '')
      const rawFile = blobInfo.blob()
      const fileName = id + rawFile.name.substring(rawFile.name.lastIndexOf('.'))
      this.client.multipartUpload(PATH + fileName, rawFile, {
        progress: p => {
          progress(p * 100)
        }
      }).then(res => {
        success(res.res.requestUrls[0].replace(/\?.*/g, ''))
      }).catch(err => {
        failure('Image upload failed due to a XHR Transport error. Code: ' + err)
      })
    }
  }
}
</script>
