<template>
  <section class="app-forum">
    <navbar />
    <div class="app-forum-container">
      <router-view />
    </div>
  </section>
</template>

<script>
import navbar from '@page/components/navbar'
import { getMesSummary } from '@/api/index'
function getParam (queryName) {
  var reg = new RegExp('(^|&)' + queryName + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r !== null) {
    return decodeURI(r[2])
  } else {
    return ''
  }
}
export default {
  components: {
    navbar
  },
  beforeRouteEnter (to, from, next) {
    // window.localStorage.setItem('DirectHost', '192.168.20.144')
    const token = getParam('token')
    if (token) {
      localStorage.setItem('token', token)
    } else {
      // const tmpToken = ''
      // const tmpToken = 'eyJhbGciOiJIUzUxMiIsInppcCI6IkRFRiJ9.eNqMU82O0zAQfpec05Wdpk3a24oT0sKJF_DPJPU2cSI7bpMiJEAcuSDEgdty4bYSgsvuAuJltrvwFozTn-0CB3KI5_v8zXg8M34anDYqmAapGFPB49GASJ4O4oiJQRpF0QBioJRymkgxCcLAOu7FjA2TcZyOJeETnqSEjiUdkmyUSU7IkKFQWYvCsquyTAmoC9bAoKnmoAcWzAKMl7AmmNLRJKGTmIzjMIC23hDRMIk8UZn8pNL5Y1YCBltf_vj19sX1xfPri_Oj2_ffr6_e3Jx9WL--Orp592l9_vH266ug99nqD1lRmfqhRJIgqMGUDyoJPkNRMGsNgJ4SQsM-W8WKqYXm3wSvy2nJNMvB9Lid1Y96-BeKQialAWtPlN34WpVrV2_de2ZWOat0fs9eKFj2RGNYt4lmQmhZubMtXgbuZBvordww6bDQ2z2KCSyUhcMDy8rgZUQnikO8j7WBkjVsukf9GZ1tYJ-ArkzJih3CNJX-M_EN0wNVwhPGi4OM7yiPFqAd3KspFq1yRvTbfk7KvG9dJCaEcZ4mlPAoiSmh3hoynERGSDzaNN83FsV25loHSDmct2MhKqcb3-4Z6MZpP8nQbsfBVAXsxkGueJ0X3b7vx7JUOrToVatQzPPCdLjYFS4NTmbrdOFCXnoXiw1cgt6trWLVzubuzipRkq-6zLvQaEjDOauWLhQzNmc6XIKaYUDVQXiqmO6Qkl1ehG3j9ae2bhHMOf5E7mm-6vxGlreF3F5291q-nf18-Xl9-WVL9yX8j4eLJbwvFZxm4xSrjVYUT0gyJvglwbPfAAAA__8.CtVbTKtzp4HtlJifuylNzFaF8v6Tyy4tTApNom9kuaeFq3nk1o7yoIGzQEcJ7LcmB7UJp01O1nqhwLurBYQwkg'
      // localStorage.setItem('token', tmpToken)
    }
    next()
  },
  beforeCreate () {
    getMesSummary().then(res => {
      this.$store.commit('getNoticeNum', res.messageCount)
    })
  }
}
</script>
