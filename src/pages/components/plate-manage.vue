<template>
  <section class="manage padding-left-size-nomal padding-right-size-nomal padding-bottom-size-large">
    <header>
      <div class="dss">
        <div class="ds">
          <el-input
            v-model="params.plateName"
            placeholder="请输入版块名称"
            suffix-icon="el-icon-search"
            style="margin-right:15px"
            @keyup.enter.native="onEnterSearch"
          />
        </div>
        <div>
          <el-button type="primary" @click="portalSet">新建</el-button>
        </div>
      </div>
    </header>
    <div style="margin-top-size-large">
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55px" /> -->
        <el-table-column fixed prop="plateName" min-width="150px" label="版块名称" />
        <el-table-column prop="plateAdminName" min-width="300px" label="版块管理员" />
        <el-table-column prop="sortNum" min-width="100px" label="排序码" />
        <el-table-column prop="createdName" label="发布人" />
        <el-table-column prop="createdDate" label="创建时间" width="150px" />
        <el-table-column label="操作" width="80px" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="handleClick(scope.row)">删除</el-button> -->
            <!-- <el-button type="text" size="small">全论坛置顶</el-button> -->
            <!-- <el-button type="text" size="small">版块置顶</el-button> -->
            <el-dropdown trigger="click" @command="title => choose(title, scope.row)">
              <span class="el-dropdown-link">
                <i class="el-icon-more" style="cursor:pointer" @click="handleClick(scope.row)" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:15px">
        <el-pagination
          :current-page="params.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="prev, pager, next, jumper, sizes, total"
          :total="totalRecords"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog title="删除版块" :visible.sync="deletePlateVisible">
      <el-form ref="transferForm" :model="transferForm" :rules="rules">
        <el-form-item :label-width="formLabelWidth">
          该版块中已有发布的内容，需要先将已发布的内容转移到其它版块
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          批量转移其中的内容至版块
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="newPlateId">
          <el-select v-model="transferForm.newPlateId" placeholder="请选择版块">
            <el-option
              v-for="plate in plateList"
              :key="plate.id"
              :label="plate.plateName"
              :value="plate.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="fr">
          <el-button @click="deletePlateVisible = false">取 消</el-button>
          <el-button type="primary" @click="transferPlate('transferForm')">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import { getPlatePage, deletePlateById, getPlateList, transferPlate } from '@/api/index'
export default {
  data () {
    return {
      plateList: [],
      params: {
        plateName: '',
        page: 1,
        pageSize: 10
      },
      // 总记录数
      totalRecords: 0,
      tableData: [],
      multipleSelection: [],
      dialogFormVisible: false,
      deletePlateVisible: false,
      formLabelWidth: '120px',
      transferForm: {
        newPlateId: null,
        oldPlateId: ''
      },
      rules: {
        newPlateId: [
          { required: true, message: '请选择版块', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.flushPlateList()
  },
  methods: {
    portalSet () {
      this.$emit('openPortal')
    },
    flushPlateList () {
      getPlatePage(this.params).then(res => {
        this.tableData = res.records
        this.totalRecords = res.totalRecords
      })
    },
    onEnterSearch () {
      this.flushPlateList()
    },
    cancel () {},
    handleClick (row) {
      // eslint-disable-next-line no-console
      console.log(row)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 全选单选
    handleSelectionChange (val) {
      this.multipleSelection = val
      // eslint-disable-next-line no-console
      console.log(val)
    },
    // 切换页码
    handleSizeChange (val) {
      this.params.pageSize = val
      this.flushPlateList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.flushPlateList()
    },
    choose (title, row) {
      if (title === 'del') {
        this.$confirm('此操作将删除该版块 , 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePlateById({ id: row.id }).then(res => {
            if (res === 1) {
              this.$message.success('删除成功')
              this.flushPlateList()
              this.$store.state.header.flushFlag++
            } else if (res === 2) {
              this.dialogFormVisible = false
              // 该版块下还有帖子
              this.plateList = []
              getPlateList().then(res => {
                for (let i = 0; i < res.length; i++) {
                  if (res[i].id === row.id) {
                    continue
                  }
                  this.plateList.push(res[i])
                }
              })
              // 转移版块弹窗
              this.transferForm.newPlateId = null
              this.transferForm.oldPlateId = row.id
              this.deletePlateVisible = true
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
        })
      } else {
        // 编辑
        this.$emit('openPortal', row.id)
      }
    },
    transferPlate (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          transferPlate(this.transferForm).then(res => {
            if (res) {
              this.$message({
                message: '转移成功',
                type: 'success'
              })
              this.deletePlateVisible = false
            } else {
              this.$message({
                message: '转移失败',
                type: 'error'
              })
            }
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.ds {
  display: flex;
}
.dss {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-collapse {
  border: none;
}
.el-pagination {
  text-align: center;
}
.el-icon-more:hover {
  color: #3396fc;
}

.manage >>> .el-dialog__footer {
  top: 225px;
  right: 240px;
}
.manage >>> .el-dialog__body {
  padding: 50px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.manage >>> .el-dialog__wrapper .el-dialog {
  margin-top: -150px !important;
}
.manage >>> .el-table__fixed-right::before,.manage >>>  .el-table__fixed::before {
  position: static;
}
</style>
