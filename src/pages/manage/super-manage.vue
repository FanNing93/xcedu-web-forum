<template>
  <section class="superManage margin-top-size-nomal auto-width auto-boxshadow">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="内容管理" name="first">
        <manage ref="articleManage" />
      </el-tab-pane>
      <el-tab-pane v-if="isAdmin" label="版块管理" name="second">
        <plateManage v-if="!isSet" ref="plateManage" @openPortal="openSetPortal" />
        <portalSet v-else :id="id" @closePortal="closeSetPortal" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import manage from '@page/components/posts-manage'
import plateManage from '@page/components/plate-manage'
import portalSet from '@page/components/portal-set'
import { userManagePlate } from '@/api/index'
export default {
  components: {
    manage,
    plateManage,
    portalSet
  },
  data () {
    return {
      activeName: 'first',
      onetab: '123',
      isSet: false,
      id: '',
      isAdmin: false
    }
  },
  created: function () {
    userManagePlate().then(res => {
      this.isAdmin = res.isAdmin
    })
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.$refs.articleManage.flushArticleList()
      } else if (tab.name === 'second') {
        this.$refs.plateManage.flushPlateList()
      }
    },
    openSetPortal (id) {
      this.id = id
      this.isSet = true
    },
    closeSetPortal () {
      this.isSet = false
    }
  }
}
</script>

<style scoped>
.superManage >>> .el-tabs__nav-wrap{
  padding-left: 30px;
}
</style>
