<template>
  <section class="padding-left-size-nomal padding-right-size-nomal padding-bottom-size-large">
    <el-form ref="numberValidateForm" :model="form" :rules="rules" size="medium">
      <el-form-item label="版块名称" :label-width="formLabelWidth" prop="plateName">
        <el-input v-model="form.plateName" placeholder="板块名称（1~10个字符）" />
      </el-form-item>
      <el-form-item label="管理员" :label-width="formLabelWidth" prop="plateAdminJson">
        <chooseUser
          ref="manager"
          v-model="form.plateAdminJson"
          :allow-write="false"
          :select-role="roles"
          :get-user="getUser"
          :get-search-list="getSearchList"
          @input="validateField('plateAdminJson')"
        />
      </el-form-item>
      <el-form-item label="排序码" :label-width="formLabelWidth" prop="sortNum">
        <el-input v-model.number="form.sortNum" placeholder="请输入排序码" />
      </el-form-item>
    </el-form>
    <span slot="footer" style="padding-left: 120px">
      <el-button type="primary" @click="saveForm('numberValidateForm')">确定</el-button>
      <el-button type="default" @click="cancal">取消</el-button>
    </span>
  </section>
</template>
<script>
// import chooseUser from '@/component/chooseUser'
import { savePlate, detailPlate, updatePlate, getChooseUserDataByParams, getSearchListByValue, getLatestSortNum } from '@/api/index'
function nameValidator (rule, value, callback) {
  if (value.trim() === '') {
    callback(new Error('版块名称不能为空'))
  } else {
    callback()
  }
}
export default {
  name: 'PortalSet',
  props: {
    id: { type: String, default: '' }
  },
  data () {
    var checkSortNum = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error('请输入排序码'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入正整数'))
      } else {
        if (value < 0) {
          callback(new Error('排序码不能为负数'))
        } else {
          callback()
        }
      }
    }

    return {
      formLabelWidth: '120px',
      form: {
        plateName: '',
        plateAdminJson: [],
        sortNum: 0
      },
      roles: ['orgUser'],
      rules: {
        plateName: [
          { required: true, message: '版块名称不能为空', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
          {
            validator: nameValidator
          }
        ],
        plateAdminJson: [
          { type: 'array', required: true, message: '管理员不能为空' }
        ],
        sortNum: [{
          validator: checkSortNum, required: true, trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    if (this.id !== '') {
      detailPlate({ id: this.id }).then(res => {
        this.form.plateName = res.plateName
        this.form.sortNum = res.sortNum
        this.form.plateAdminJson = JSON.parse(res.plateAdminJson)
      })
    } else {
      getLatestSortNum().then(res => {
        window.console.log(res)
        this.form.sortNum = res + 1
      })
    }
  },
  methods: {
    getUser: getChooseUserDataByParams,
    getSearchList: getSearchListByValue,
    validateField (type) {
      this.$refs.numberValidateForm.validateField(type)
    },
    saveForm (formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submit()
        } else {
          return false
        }
      })
    },
    submit () {
      const params = {
        id: this.id,
        plateName: this.form.plateName,
        plateAdminJson: JSON.stringify(this.form.plateAdminJson),
        sortNum: this.form.sortNum
      }
      // 提交表单 成功后返回列表
      if (this.id === '') {
        savePlate(params).then(res => {
          if (res) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$store.state.header.flushFlag++
          } else {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
          }
          this.$emit('closePortal')
        })
      } else {
        updatePlate(params).then(res => {
          if (res) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$store.state.header.flushFlag++
          } else {
            this.$message({
              message: '修改失败',
              type: 'error'
            })
          }
          this.$emit('closePortal')
        })
      }
    },
    cancal () {
      this.$emit('closePortal')
    }
  }
}
</script>
