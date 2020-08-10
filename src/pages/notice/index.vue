<template>
  <section class="layout-list-content padding-top-size-nomal padding-bottom-size-nomal" style="overflow:auto">
    <el-card class="margin-lr-auto" style="width: 840px;">
      <div slot="header">
        <el-badge :value="mesSummary.noticeSum == 0? '' :mesSummary.noticeSum" :max="99" class="item">
          <span :class="{ color: isNotice }" class="pointer" @click="toggleTab">通知</span>
        </el-badge>
        <el-badge :value="mesSummary.commentSum == 0? '' :mesSummary.commentSum" :max="99" class="item">
          <span :class="{ color: !isNotice }" class="pointer margin-left-size-large" @click="toggleTab">评论</span>
        </el-badge>
      </div>
      <div v-infinite-scroll="load" class="list" infinite-scroll-disabled="disabled">
        <div v-for="(notice,index) in notices" :key="notice.id" class="list-item clearfix">
          <div class="fl margin-right-size-small">
            <el-avatar v-if="notice.noticeAnonymous === 0 && notice.imgUrl" :src="'/api/v1/' + notice.imgUrl + '&access_token=' + accessToken" />
            <div v-if="notice.noticeAnonymous === 0 && !notice.imgUrl" style="width:40px;height:40px;border-radius:50%;background:#3396fc;color:#fff;line-height:40px;text-align:center">
              {{ notice.initiateBy.slice(notice.initiateBy.length - 2 , notice.initiateBy.length) }}
            </div>
            <el-avatar v-if="notice.noticeAnonymous === 1" :src="require('@/assets/user.png')" />
          </div>
          <div class="fl" style="width: calc(100% - 65px);">
            <div class="bold">{{ notice.initiateBy }}</div>
            <div class="margin-top-size-mix text-color-grey">{{ notice.createdDate }}</div>
            <div class="margin-top-size-nomal">
              <span>
                {{ notice.noticeContent != null ? notice.noticeContent : notice.commentContent }}
              </span>
              <span v-if="!isNotice && notice.articleIsDelete===0" style="float:right;cursor:pointer" class="el-icon-chat-line-round" @click.stop="showTag(notice.commentId,index)">
                回复
              </span>
            </div>
            <div v-if="notice.articleIsDelete===0" class="margin-top-size-small padding-left-right-size-nomal padding-top-bottom-size-small bg-grey" style="cursor:pointer" @click="preViewDetails(notice.articleId)">
              <span class="color">{{ notice.subName }}</span>
              <span v-if="notice.noticeType !== 5">{{ notice.articleTitle != null ? notice.articleTitle : notice.previousCommentContent }}</span>
              <span v-if="notice.noticeType === 5">{{ notice.commentContent }}</span>
            </div>
            <div v-else-if="notice.noticeType!==7" class="margin-top-size-small padding-left-right-size-nomal padding-top-bottom-size-small bg-grey">
              <span class="color">该帖子已删除</span>
            </div>
            <div v-else class="margin-top-size-small padding-left-right-size-nomal padding-top-bottom-size-small bg-grey">
              <span class="color">{{ notice.subName }}</span>
              <span v-if="notice.noticeType !== 5">{{ notice.articleTitle != null ? notice.articleTitle : notice.previousCommentContent }}</span>
              <span v-if="notice.noticeType === 5">{{ notice.commentContent }}</span>
            </div>
          </div>
          <div class="clearfix" />
          <div class="fa-more replay margin-top-size-nomal" style="margin-top: 20px; margin-left: -20px; margin-right: -20px;">
            <transition name="el-fade-in-linear">
              <el-card v-show="tag[index]" ref="operate" style="border: 0 none; box-shadow:inset 1px 3px 3px rgba(0,0,0,.05)">
                <!-- <div class="top" /> -->
                <div style="display:flex">
                  <el-col :span="2" class="mr-10">
                    <el-avatar v-if="userInfo.userAvator" :src="'/api/v1/' + userInfo.userAvator + '&access_token=' + accessToken" />
                    <div v-else style="width:40px;height:40px;border-radius:50%;background:#3396fc;color:#fff;line-height:40px;text-align:center">
                      {{ userInfo.userName.slice(userInfo.userName.length - 2 , userInfo.userName.length) }}
                    </div>
                  </el-col>
                  <el-col :span="22">
                    <el-input v-model="repInput" :placeholder="'回复  '+ notice.initiateBy +' ：'" />
                  </el-col>
                </div>
                <div class="dss">
                  <el-col :span="2">
                    <div />
                  </el-col>
                  <el-col :span="22" class="dss">
                    <el-checkbox v-model="anonymous">匿名回复</el-checkbox>
                    <el-button type="primary" size="small" @click="repSave(notice.commentTopId,notice.commentId,index)">回复</el-button>
                  </el-col>
                </div>
              </el-card>
            </transition>
          </div>
          <el-divider />
        </div>
        <p v-if="loading" style="text-align:center">加载中...</p>
        <p v-if="noMore" style="text-align:center">没有更多了</p>
      </div>
    </el-card>
  </section>
</template>
<script>
import { getNoticeList, getMesSummary, getUserSetting, saveComment } from '@/api/index'
export default {
  data () {
    return {
      userInfo: {
        userAvator: '',
        userAliasName: '',
        trueName: ''
      },
      repInput: '',
      tag: {},
      isNotice: true,
      notices: [],
      loading: false,
      params: {
        flag: 0,
        page: 1,
        pageSize: 5
      },
      anonymous: false,
      // 总记录数
      totalRecords: 1,
      mesSummary: {
        commentSum: 0,
        messageCount: 0,
        noticeSum: 0
      },
      accessToken: localStorage.getItem('token')
    }
  },
  computed: {
    noMore () {
      return (this.params.page - 1) * this.params.pageSize >= this.totalRecords
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  mounted: function () {
    getUserSetting().then(res => {
      this.userInfo = {
        userAvator: res.imgUrl,
        userAliasName: res.userAliasName,
        userName: res.trueName
      }
    })
  },
  methods: {
    load () {
      this.loading = true
      this.params.pageSize = 5
      this.flushNoticeList().then(res => {
        this.params.page += 1
        this.totalRecords = res.totalRecords
        this.loading = false
      })
    },
    preViewDetails (id) {
      const { href } = this.$router.resolve({ name: 'previewDetails' })
      window.open(href + '?id=' + id, '_self')
    },
    toggleTab () {
      this.isNotice = !this.isNotice
      if (this.isNotice) {
        this.params.flag = 0
      } else {
        this.params.flag = 1
      }
      this.notices = []
      this.params.page = 1
      this.totalRecords = 6
    },
    flushNoticeList () {
      return getNoticeList(this.params).then(res => {
        for (let i = 0; i < res.records.length; i++) {
          this.notices.push(res.records[i])
        }
        getMesSummary().then(res => {
          this.mesSummary = res
          this.$store.commit('getNoticeNum', res.messageCount)
        })
        return res
      })
    },
    repSave (topId, commentId, index) {
      if (!this.repInput) {
        this.$message({
          message: '请输入回复内容',
          type: 'warning'
        })
        return false
      }
      saveComment({ anonymous: (this.anonymous ? 1 : 0), commentContent: this.repInput, commentTopId: topId ? topId : commentId, commentId: commentId }).then(res => {
        if (res) {
          this.$message({
            message: '回复成功',
            type: 'success'
          })
          this.anonymous = false
          this.repInput = ''
          this.$set(this.tag, index, false)
        } else {
          this.$message({
            message: '回复保存失败',
            type: 'error'
          })
        }
      })
    },
    showTag (articleId, index) {
      this.repInput = ''
      this.anonymous = false
      // 循环对象 修改属性
      if (this.tag[index]) {
        Object.keys(this.tag).forEach((index) => {
          this.tag[index] = false
        })
        this.$set(this.tag, index, false)
      } else {
        this.repInput = ''
        Object.keys(this.tag).forEach((index) => {
          this.tag[index] = false
        })
        this.$set(this.tag, index, true)
      }
    }
  }

}
</script>

<style scoped>
.dss{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .item {
  margin-top: 0px;
  margin-right: 10px;
  margin-bottom:0
}
</style>
