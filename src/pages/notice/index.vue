<template>
  <section class="layout-list-content padding-top-size-nomal padding-bottom-size-nomal">
    <el-card class="margin-lr-auto" style="width: 840px;">
      <div slot="header">
        <span :class="{ color: isNotice }" class="pointer" @click="toggleTab">通知</span>
        <span :class="{ color: !isNotice }" class="pointer margin-left-size-large" @click="toggleTab">评论</span>
      </div>
      <div v-infinite-scroll="load" class="list" infinite-scroll-disabled="disabled" infinite-scroll-immediate="false">
        <div v-for="notice in notices" :key="notice.id" class="list-item clearfix">
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
            <div class="margin-top-size-nomal">{{ notice.noticeContent != null ? notice.noticeContent : notice.commentContent }}</div>
            <div v-if="notice.articleIsDelete===0" class="margin-top-size-small padding-left-right-size-nomal padding-top-bottom-size-small bg-grey" @click="preViewDetails(notice.articleId)">
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
          <el-divider />
        </div>
        <p v-if="loading" style="text-align:center">加载中...</p>
        <p v-if="noMore" style="text-align:center">没有更多了</p>
      </div>
    </el-card>
  </section>
</template>
<script>
import { getNoticeList, getMesSummary } from '@/api/index'
export default {
  data () {
    return {
      isNotice: true,
      notices: [],
      loading: false,
      params: {
        flag: 0,
        page: 1,
        pageSize: 10
      },
      // 总记录数
      totalRecords: 0,
      accessToken: localStorage.getItem('token')
    }
  },
  computed: {
    noMore () {
      return (this.params.page - 1) * this.params.pageSize > this.totalRecords
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  mounted: function () {
    getNoticeList(this.params).then(res => {
      this.notices = res.records
      this.totalRecords = res.totalRecords
      this.params.page += 2
      getMesSummary().then(res => {
        this.$store.commit('getNoticeNum', res.messageCount)
      })
    })
  },
  methods: {
    load () {
      this.loading = true
      this.params.pageSize = 5
      this.flushNoticeList().then(res => {
        this.params.page += 1
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
      this.params.page = 1
      this.params.pageSize = 10
      getNoticeList(this.params).then(res => {
        this.notices = res.records
        this.totalRecords = res.totalRecords
        this.params.page += 2
        getMesSummary().then(res => {
          this.$store.commit('getNoticeNum', res.messageCount)
        })
      })
    },
    flushNoticeList () {
      return getNoticeList(this.params).then(res => {
        for (let i = 0; i < res.records.length; i++) {
          this.notices.push(res.records[i])
        }
      })
    }
  }
}
</script>
