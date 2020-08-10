<template>
  <section class="padding-left-size-nomal padding-right-size-nomal padding-bottom-size-large ">
    <header>
      <div class="dss">
        <div class="ds">
          <el-input
            v-model="params.articleTitle"
            placeholder="请输入标题"
            suffix-icon="el-icon-search"
            style="margin-right:15px"
            @keyup.enter.native="onEnterSearch"
          />
          <el-button type="primary" @click="showAdvance">高级搜索</el-button>
        </div>
        <div>
          <el-button type="primary" @click="batchDelete">批量删除</el-button>
        </div>
      </div>
      <div>
        <el-collapse-transition>
          <div v-if="advancedSearch" class="padding-top-size-nomal advance-search-container margin-top-size-nomal padding-left-size-nomal padding-right-size-nomal" style="margin-left: -20px; margin-right: -20px;">
            <div class="dss">
              <div style="width: 30%">
                <span style="margin-right:10px">发布人</span>
                <el-input v-model="params.articleAuthor" style="width: 60%" />
              </div>
              <div style="width: 30%">
                <span style="margin-right:10px">所属版块</span>
                <el-select v-model="params.plateId" placeholder="请选择" style="width: 60%">
                  <el-option
                    v-for="plate in plateList"
                    :key="plate.id"
                    :label="plate.plateName"
                    :value="plate.id"
                  />
                </el-select>
              </div>
              <div>
                <span style="margin-right:10px">发布时间</span>
                <el-date-picker
                  v-model="publishDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                />
              </div>
            </div>
            <div class="ds margin-top-size-nomal" style="margin-left: 55px">
              <el-button type="primary" @click="retrieval">搜索</el-button>
              <el-button @click="cancel">清除</el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </header>
    <div class="margin-top-size-large">
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" @row-click="rowClick">
        <el-table-column type="selection" width="55px" />
        <el-table-column fixed prop="articleTitle" label="标题" min-width="300px" />
        <el-table-column prop="plateName" label="所属版块" />
        <el-table-column prop="aliasName" label="发布人" />
        <el-table-column prop="pubDate" label="发布时间" width="150px" />
        <el-table-column prop="readNum" label="阅读" />
        <el-table-column label="操作" width="80px" fixed="right" prop="operate">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="title => choose(title, scope.row)">
              <span class="el-dropdown-link">
                <i class="el-icon-more" style="cursor:pointer" @click="handleClick(scope.row)" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="del">删除</el-dropdown-item>
                <el-dropdown-item v-show="scope.row.userIsAdmin" command="forumTop"><span v-show="scope.row.forumTop">取消</span>全论坛置顶</el-dropdown-item>
                <el-dropdown-item command="plateTop"><span v-show="scope.row.plateTop">取消</span>版块置顶</el-dropdown-item>
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
  </section>
</template>

<script>
import {
  getArticleList,
  deleteArticle,
  articleTop,
  getPlateList
} from '@/api/index'
export default {
  props: {
    onetab: {
      type: String,
      default: '' // 默认值
    }
  },
  data () {
    return {
      forumTop: false,
      plateTop: false,
      advancedSearch: false,
      plateList: [],
      publish: '',
      publishDateRange: [],
      params: {
        orderType: 2,
        articleTitle: '',
        articleAuthor: '',
        plateId: '',
        pubTimeStart: '',
        pubTimeEnd: '',
        page: 1,
        pageSize: 10
      },
      // 总记录数
      totalRecords: 0,
      tableData: [],
      multipleSelection: [],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.flushArticleList()
    getPlateList().then(res => {
      this.plateList = res
    })
  },
  methods: {
    flushArticleList () {
      getArticleList(this.params).then(res => {
        this.tableData = res.records
        this.totalRecords = res.totalRecords
      })
    },
    onEnterSearch () {
      this.flushArticleList()
    },
    rowClick (row, column) {
      window.console.log(column)
      if (column.property === 'operate') {
        return
      }
      const { href } = this.$router.resolve({ name: 'previewDetails' })
      window.open(href + '?id=' + row.id, '_self')
    },
    showAdvance () {
      this.advancedSearch = !this.advancedSearch
    },
    retrieval () {
      this.params.page = 1
      this.params.pageSize = 10
      this.params.pubTimeStart = this.publishDateRange[0]
      this.params.pubTimeEnd = this.publishDateRange[1]
      this.flushArticleList()
    },
    cancel () {
      this.params.articleTitle = ''
      this.params.articleAuthor = ''
      this.params.plateId = ''
      this.params.pubTimeStart = ''
      this.params.pubTimeEnd = ''
      this.publishDateRange = ''
      this.flushArticleList()
    },
    handleClick (row) {
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
    // 全选单选 或者批量删除
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach(value => {
        this.multipleSelection.push(value.id)
      })
    },
    deleteArticle (params) {
      deleteArticle(params).then(res => {
        if (res) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.flushArticleList()
        } else {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        }
      })
    },
    batchDelete () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '未选中数据',
          type: 'warning'
        })
        return
      }
      this.$confirm('此操作将删除选中的帖子, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const req = {
          ids: this.arrayToStrWithOutComma(this.multipleSelection)
        }
        this.deleteArticle(req)
      })
    },
    // 切换页码
    handleSizeChange (val) {
      this.params.pageSize = val
      this.flushArticleList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.flushArticleList()
    },
    choose (title, row) {
      if (title === 'del') {
        this.$confirm('此操作将删除该帖子 , 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteArticle({ ids: row.id })
        })
      } else if (title === 'forumTop') {
        let warningMsg = '此操作将把帖子全论坛置顶, 是否继续?'
        let successMsg = '置顶成功'
        let failureMsg = '置顶失败'
        let topFlag = 1
        if (row.forumTop === 1) {
          warningMsg = '此操作将取消帖子全论坛置顶, 是否继续?'
          successMsg = '取消置顶成功'
          failureMsg = '取消置顶失败'
          topFlag = 0
        }
        this.$confirm(warningMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          articleTop({ id: row.id, flag: 'forum', topFlag: topFlag }).then(res => {
            if (res) {
              this.$message({
                message: successMsg,
                type: 'success'
              })
              this.flushArticleList()
            } else {
              this.$message({
                message: failureMsg,
                type: 'error'
              })
            }
          })
        })
      } else {
        let warningMsg = '此操作将把帖子版块置顶, 是否继续?'
        let successMsg = '置顶成功'
        let failureMsg = '置顶失败'
        let topFlag = 1
        if (row.plateTop === 1) {
          warningMsg = '此操作将取消帖子版块置顶, 是否继续?'
          successMsg = '取消置顶成功'
          failureMsg = '取消置顶失败'
          topFlag = 0
        }
        this.$confirm(warningMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          articleTop({ id: row.id, flag: 'plate', topFlag: topFlag }).then(res => {
            if (res) {
              this.$message({
                message: successMsg,
                type: 'success'
              })
              this.flushArticleList()
            } else {
              this.$message({
                message: failureMsg,
                type: 'error'
              })
            }
          })
        })
      }
    },
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          alert('error submit!!')
          return false
        }
      })
    },
    arrayToStrWithOutComma (arr, attr) {
      let str = ''
      if (attr) {
        for (const i of arr) {
          str += i[attr] + ','
        }
      } else {
        for (const i of arr) {
          str += i + ','
        }
      }
      return str.substring(0, str.lastIndexOf(','))
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
</style>
