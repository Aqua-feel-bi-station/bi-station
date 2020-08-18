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
            label: '店舗メッセージ',
            data: this.qjin.top
          },
          {
            label: '店舗名',
            data: this.qjin.name
          },
          {
            label: '募集職種',
            data: this.qjin.need_class
          },
          {
            label: '雇用形態',
            data: this.qjin.hire_style
          },
           {
            label: '仕事内容',
            data: this.qjin.content
          },
           {
            label: '対象となる方',
            data: this.qjin.target
          },
          {
            label: '勤務時間',
            data: this.qjin.hour
          },
        ]
      },
    },
    mounted () {
      firebase.firestore().collection('salons').doc(this.$route.params.id)
        .collection('Qjins').doc(this.$route.params.qjin_id).get()
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