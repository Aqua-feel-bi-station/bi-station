<template>
<div>
<v-simple-table>
  <template v-slot:default>
      <tbody>
        <tr class="d-sm-flex" v-for="item in contents" :key="item.id">
          <th>{{ item.label }}</th>
          <td>{{ item.data }}</td>
        </tr>
      </tbody> 
      <div style="text-align: center;">
        <v-btn depressed large style="background:orange;color:white;">お気に入り</v-btn>
         <v-btn depressed large color="primary">Webで応募</v-btn>
      </div>
    </template>
</v-simple-table>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

  export default {
    data () {
      return {
        qjin: {},
      }
    },
    computed: {
      contents () {
        return [
          {
            label: '店舗名',
            data: this.qjin.name
          },
          {
            label: '募集職種',
            data: this.qjin.name
          },
          {
            label: '雇用形態',
            data: '正社員'
          },
           {
            label: '仕事内容',
            data: `カット、カラー、シャンプー、ブロー、パーマ
                    などの施術を行い、ヘアスタイルを作り上げる`
          },
           {
            label: '対象となる方',
            data: '美容師免許'
          },
          {
            label: '勤務時間',
            data: `10:00〜20:00

            【正社員】フルタイム勤務
            【準社員】フルタイムより1時間～2時間短い勤務`
          },
        ]
      }
    },
    mounted () {
      firebase.firestore().collection('Qjins').doc(this.$route.params.id).get()
        .then((doc) => {
          this.qjin = doc.data()
          // if (doc.exists) {
          // } else {
          //   throw new Error('ページが見つかりません')
          // }
        })
        // .catch((e) => {
        //   error({ statusCode: 404, message: 'ページが見つかりません' })
        // })
    },
  }
</script>

<style scoped>
table {
  border-collapse: collapse;
}
table td, table th {
  display: block;
  padding: 10px;
}
table th {
  background-color: #eee;
  width: 10%
}
@media screen and (max-width: 0px) {
    width: 100%;
  }

</style>