<template>
  <section style="width: 840px; margin: 0 auto; background: #fff;margin-top:20px">
    <el-card>
      <div style="display:flex;align-items:center;justify-content: space-between;">
        <div style="display:flex;align-items:center;">
          <el-avatar v-if="article.anonymous === 0 && article.imgUrl" :src="'/api/v1/' + article.imgUrl + '&access_token=' + accessToken" />
          <div v-if="article.anonymous === 0 && !article.imgUrl && article.aliasName" style="width:40px;height:40px;border-radius:50%;background:#3396fc;color:#fff;line-height:40px;text-align:center">
            {{ article.aliasName.slice(-2) }}
          </div>
          <el-avatar v-if="article.anonymous === 1" :src="require('@/assets/user.png')" />
          <div>
            <div style="margin-left:10px">{{ article.aliasName }}</div>
            <div style="margin-left: 10px;margin-top:5px;">{{ article.pubDate }}</div>
          </div>

        </div>
        <div>
          <el-button type="default" @click="goBacktToHome">返回首页</el-button>
        </div>
      </div>
      <div style="padding:10px;font-size:20px" v-html="article.articleTitle" />
      <div style="padding:10px;text-indent: 25px;line-height: 20px;" v-html="article.articleContent" />
      <div />

      <div style="display:flex;justify-content:space-between;padding:10px;">
        <div style="color:#3396fc">
          <!-- <span v-show="article.userIsAdmin" class="operate" @click="edit">编辑</span> -->
          <span v-show="article.userIsAdmin||article.userIsAuthor" class="operate" @click="deleteArticle">删除</span>
          <span v-show="article.userIsAdmin && article.forumTop === 0" class="operate" @click="topArticle('forum',1)">全论坛置顶</span>
          <span v-show="article.userIsAdmin && article.forumTop === 1" class="operate" @click="topArticle('forum',0)">取消论坛置顶</span>
          <span v-show="article.userIsAdmin && article.plateTop === 0" class="operate" @click="topArticle('plate',1)">板块置顶</span>
          <span v-show="article.userIsAdmin && article.plateTop ===1" class="operate" @click="topArticle('plate',0)">取消板块置顶</span>
        </div>
        <div>
          <span v-show="!article.userHasLike" class="operate" @click="likeArticle(1)">
            <i class="icon-zan" />
            点赞（{{ article.likeNum }}）
          </span>
          <span v-show="article.userHasLike" class="operate" @click="likeArticle(0)">
            <i class="icon-zan-shixin red" />
            取消点赞（{{ article.likeNum }}）
          </span>
          <span v-show="!article.userHasAttention" class="operate" @click="attentionArticle(1)">
            <i class="icon-star-hollow" />
            收藏（{{ article.attentionNum }}）
          </span>
          <span v-show="article.userHasAttention" class="operate" @click="attentionArticle(0)">
            <i class="icon-star-solid yellow" />
            取消收藏（{{ article.attentionNum }}）
          </span>
        </div>
      </div>
      <div class="fa-more replay margin-top-size-nomal" style="margin-top: 20px; margin-left: -20px; margin-right: -20px;">
        <transition name="el-fade-in-linear">
          <el-card ref="operate" style="border: 0 none; box-shadow: non; box-shadow:inset 1px 3px 3px rgba(0,0,0,.05)">
            <!-- <div class="top" /> -->
            <div style="display:flex">
              <el-col :span="2" class="mr-10">
                <el-avatar v-if="userInfo.userAvator" :src="'/api/v1/'+userInfo.userAvator+'&access_token=' + accessToken" />
                <div v-if="userInfo.userName && !userInfo.userAvator" style="width:40px;height:40px;border-radius:50%;background:#3396fc;color:#fff;line-height:40px;text-align:center">
                  {{ userInfo.userName.slice(-2) }}
                </div>
              </el-col>
              <el-col :span="22">
                <el-input v-model="commentInput" placeholder="请输入内容" />
              </el-col>
            </div>
            <div class="dss">
              <el-col :span="2">
                <div />
              </el-col>
              <el-col :span="22" class="dss">
                <el-checkbox v-model="anonymous">匿名评论</el-checkbox>
                <el-button type="primary" size="small" @click="sendComment()">发表</el-button>
              </el-col>
            </div>
            <div v-for="(comment,num) in comments" :key="num" class="margin-top-size-mix padding-top-size-mix replay-line" style="display:flex; ">
              <el-col :span="2" class="mr-10">
                <el-avatar v-if="comment.anonymous === 0 && comment.imgUrl" :src="'/api/v1/'+comment.imgUrl+'&access_token=' + accessToken" />
                <div v-if="comment.anonymous === 0 && !comment.imgUrl && comment.aliasName" style="width:40px;height:40px;border-radius:50%;background:#3396fc;color:#fff;line-height:40px;text-align:center">
                  {{ comment.aliasName.slice(-2) }}
                </div>
                <el-avatar v-if="comment.anonymous === 1" :src="require('@/assets/user.png')" />
              </el-col>
              <el-col :span="22">
                <div>
                  <span class="color">{{ comment.aliasName }} </span>
                  <span>: {{ comment.commentContent }}</span>
                </div>
                <div class="dss text-color-grey  margin-top-size-mix ">
                  <span>{{ comment.createdDate }}</span>
                  <div>
                    <span style="cursor:pointer" @click="reflex(comment.id,comment.aliasName,num)">回复（{{ comment.commentVoList.length }}）</span>
                    <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    <span v-show="comment.userHasLike" style="cursor:pointer" @click="likeComment(num,comment.id,0)">
                      <i class="icon-zan-shixin red" />
                      <span>&nbsp;&nbsp;{{ comment.commentLikeNum == null ? 0 : comment.commentLikeNum }}</span>
                    </span>
                    <span v-show="!comment.userHasLike" style="cursor:pointer" @click="likeComment(num,comment.id,1)">
                      <i class="icon-zan" />
                      <span>&nbsp;&nbsp;{{ comment.commentLikeNum == null ? 0 : comment.commentLikeNum }}</span>
                    </span>
                  </div>
                </div>

                <div v-show="restore[num]">
                  <div v-for="(reply,repIndex) in comment.commentVoList" :key="repIndex" style="margin-top:10px">
                    <span class="color">{{ reply.aliasName }}</span>
                    <span>回复</span>
                    <span class="color">{{ reply.commentAliasName }}</span>
                    <span> : </span>
                    <span style="margin-left:10px">{{ reply.commentContent }}</span>
                    <div class="text-color-grey" style="margin-top:5px">
                      <span>{{ reply.createdDate }}</span>
                      <span style="margin-left:10px;cursor:pointer" class="el-icon-chat-line-round" @click="repReply(reply.id,comment.id,reply.aliasName)" />
                    </div>
                  </div>
                  <div style="display:flex">
                    <el-col :span="24" style="margin-top:10px">
                      <el-input v-model="repInput" :placeholder="'回复 ' + repName +' : '" />
                    </el-col>
                  </div>
                  <div class="dss" style="margin-top:10px">
                    <el-col :span="24" class="dss">
                      <el-checkbox v-model="repChecked">匿名回复</el-checkbox>
                      <el-button type="primary" size="small" @click="repSave(num)">回复</el-button>
                    </el-col>
                  </div>
                </div>
              </el-col>
            </div>
          </el-card>
        </transition>
      </div>
    </el-card></section>

</template>
<script>
import { getArticleById, commentList, saveComment, deleteArticle, getUserSetting, attentionArticle, likeArticle, topArticle, likeComment } from '@/api/index'
import { arrayToStrWithOutComma } from '@/util/index'
export default {
  name: 'PreviewDetail',
  data () {
    return {
      article: {

      },
      accessToken: localStorage.getItem('token'),
      restore: {},
      anonymous: false,
      commentInput: '',
      comments: [],
      userInfo: {},
      repComId: '',
      resTopId: '',
      repName: '',
      repInput: '',
      repChecked: false,
      clickState: true
    }
  },

  mounted: function () {
    const id = this.$route.query.id
    if (id) {
      getArticleById(id).then(res => {
        this.article = res
      })
      commentList({ articleId: id, pageSize: 1000, pageNumber: 1 }).then(res => {
        this.comments = res.records
      })
      getUserSetting().then(res => {
        this.userInfo = {
          userAvator: res.imgUrl,
          userAliasName: res.userAliasName,
          userName: res.trueName
        }
      })
    }
  },
  methods: {
    deleteArticle () {
      this.$confirm('此操作将删除该帖子, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle({ ids: arrayToStrWithOutComma(this.article.id.split(',')) }).then(res => {
          if (!res) {
            this.$message.error('删除失败，请稍后再试')
          } else {
            this.$message.success('删除成功')
            this.$router.push({ name: 'home' })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    goBacktToHome () {
      this.$router.push({ name: 'home' })
    },
    topArticle (flag, topFlag) {
      if (this.clickState) {
        this.clickState = false
        topArticle({ id: this.article.id, flag: flag, topFlag: topFlag }).then(res => {
          if (!res) {
            this.$message.error('操作失败，请稍后再试')
          } else {
            if (flag === 'forum') {
              this.article.forumTop = topFlag
            } else {
              this.article.plateTop = topFlag
            }
            this.$message.success('操作成功')
          }
          this.clickState = true
        })
      }
    },
    sendComment () {
      if (!this.commentInput) {
        this.$message.error('请输入评论内容')
        return false
      }
      saveComment({ articleId: this.article.id, anonymous: (this.anonymous ? 1 : 0), commentContent: this.commentInput }).then(res => {
        if (res) {
          this.$message.success('评论成功')
          this.article.commentNum++
          this.comments.push({ id: res.id, aliasName: res.aliasName, anonymous: res.anonymous, commentContent: res.commentContent, createdDate: '刚刚', commentVoList: [], imgUrl: this.userInfo.userAvator, userHasLike: false, commentLikeNum: 0 })
          this.commentInput = ''
        } else {
          this.$message.error('评论保存失败')
        }
      })
    },
    repSave (num) {
      if (!this.repInput) {
        this.$message.error('请输入回复内容')
        return false
      }
      saveComment({ anonymous: (this.repChecked ? 1 : 0), commentContent: this.repInput, commentTopId: this.repTopId, commentId: this.repComId }).then(res => {
        if (res) {
          this.$message.success('回复成功')
          this.comments[num].commentVoList.push({ id: res.id, aliasName: res.aliasName, anonymous: res.anonymous, commentContent: res.commentContent, createdDate: '刚刚', commentAliasName: this.repName, imgUrl: this.userInfo.userAvator })
          this.repChecked = false
          this.repInput = ''
        } else {
          this.$message.error('回复保存失败')
        }
      })
    },
    likeArticle (flag) {
      if (this.clickState) {
        this.clickState = false
        likeArticle({ articleId: this.article.id, flag: flag }).then(res => {
          if (!res) {
            this.$message.error('操作失败')
          } else if (flag === 0) {
            this.article.likeNum--
            this.article.userHasLike = false
            this.$message.success('取消点赞成功')
          } else if (flag === 1) {
            this.article.likeNum++
            this.article.userHasLike = true
            this.$message.success('点赞成功')
          }
          this.clickState = true
        })
      }
    },
    likeComment (index, commentId, flag) {
      if (this.clickState) {
        this.clickState = false
        likeComment({ index, commentId: commentId, flag: flag }).then(res => {
          if (res) {
            this.$message.success('点赞成功')
            if (flag === 0) {
              this.comments[index].userHasLike = false
              this.comments[index].commentLikeNum--
            } else {
              this.comments[index].userHasLike = true
              this.comments[index].commentLikeNum++
            }
          } else {
            this.$message.error('点赞失败')
          }
          this.clickState = true
        })
      }
    },
    attentionArticle (flag) {
      if (this.clickState) {
        this.clickState = false
        attentionArticle({ id: this.article.id, flag: flag }).then(res => {
          if (!res) {
            this.$message.error('收藏失败，请稍后再试')
          } else if (flag === 0) {
            this.article.attentionNum--
            this.article.userHasAttention = false
            this.$message.success('取消收藏成功')
          } else if (flag === 1) {
            this.article.attentionNum++
            this.article.userHasAttention = true
            this.$message.success('收藏成功')
          }
          this.clickState = true
        })
      }
    },
    repReply (id, topId, repName) {
      this.repComId = id
      this.repTopId = topId
      this.repName = repName
    },
    reflex (id, aliasName, index) {
      this.repComId = id
      this.repTopId = id
      this.repName = aliasName
      // 循环对象 修改属性
      if (this.restore[index]) {
        this.search = ''
        Object.keys(this.restore).forEach((index) => {
          this.restore[index] = false
        })
        this.$set(this.restore, index, false)
      } else {
        this.search = ''
        Object.keys(this.restore).forEach((index) => {
          this.restore[index] = false
        })
        this.$set(this.restore, index, true)
      }
    }
    // edit () {
    //   // const { href } = this.$router.resolve({ name: 'newArtical' })
    //   // window.open(href + '?id=' + this.$route.query.id, '_self')
    //   this.$router.push({
    //     path: '/mfs-forum/newArtical',
    //     query: {
    //       id: this.$route.query.id
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>
  .dss{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .operate{
    margin-right:15px;cursor:pointer;
  }
</style>
