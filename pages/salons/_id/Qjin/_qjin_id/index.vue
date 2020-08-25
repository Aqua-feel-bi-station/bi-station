<template>
 <v-row justify="center">
   <v-col cols="12" md="10">
 <h1 class="text-center primary--text line mb-5">{{qjin.title}}</h1>
  <v-row>
    <v-col cols="12" md="4">
      <span v-for="(url, id) in qjin.salon_images" :key="id">
      <span class="image-span mt-2 ml-2">
        <img :src="url" class="image">
      </span>
    </span>
    </v-col>
    <v-col cols="12" md="8">
       <p class="message">{{qjin.message}}</p>
    </v-col>
  </v-row>
   <div class="text-center">
  </div>

<h3 class="text-center line primary--text mb-3">求人情報</h3>
<v-simple-table>
  <template v-slot:default>
    <tbody>
      <tr class="d-sm-flex" v-for="item in contents" :key="item.id">
        <th class="d-flex align-center justify-center">{{ item.label }}</th>
        <td class="d-flex align-center">{{ item.data }}</td>
      </tr>
    </tbody>
  </template>
</v-simple-table>
<div style="text-align: center;" class="mb-10">
  <v-btn depressed large style="background:orange;color:white;">お気に入り</v-btn>
    <v-btn depressed large color="primary">Webで応募</v-btn>
</div>

<h3 class="text-center line primary--text mb-3">企業情報</h3>
<v-simple-table>
  <template v-slot:default>
    <tbody>
      <tr class="d-sm-flex" v-for="item in salonItems" :key="item.id">
        <th class="d-flex align-center justify-center" >{{ item.label }}</th>
        <td class="d-flex align-center">{{ item.data }}</td>
      </tr>
    </tbody>
  </template>
</v-simple-table>
  </v-col>
 </v-row>
</template>

<script>
import firebase from '@/plugins/firebase'

  export default {
    data () {
      return {
        qjin: {},
        salon: {},
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
            label: '給与',
            data: this.qjin.payment
          },
          {
            label: '勤務時間',
            data: this.qjin.hour
          },
          {
            label: '福利厚生',
            data: this.qjin.welfale
          },
          {
            label: '休日',
            data: this.qjin.holiday
          },
          {
            label: '勤務地',
            data: this.qjin.place
          },
          {
            label: 'アクセス',
            data: this.qjin.access
          },
        ]
      },
      salonItems(){
        const unregistered = '(未登録)'
        return[
        {
          label: '店舗住所',
          data: this.salon.address
        },
        {
          label: '企業名',
          data: this.salon.company_name
        },
        {
          label: '創立',
          data: this.salon.establishment_year && this.salon.establishment_month ?
            `${this.salon.establishment_year}年${this.salon.establishment_month}月` :
            unregistered
        },
        {
          label: '代表者',
          data: this.salon.representative_last && this.salon.representative_first ?
            `${this.salon.representative_last} ${this.salon.representative_first}` :
            unregistered
        },
        {
          label: '資本金',
          data: this.salon.capital ? `${this.salon.capital}円` : unregistered
        },
        {
          label: '従業員数',
          data: this.salon.employee_number ? `${this.salon.employee_number} 名` : unregistered
        },
        {
          label: '業務内容',
          data: this.salon.job_description || unregistered
        },
        {
          label: 'ホームページURL',
          data: this.salon.home_page_url || unregistered
        }
        ]

      },
    },
    mounted () {
      firebase.firestore().collection('salons').doc(this.$route.params.id)
        .collection('Qjins').doc(this.$route.params.qjin_id).get()
        .then((doc) => {
          this.qjin = doc.data()
      })
      firebase.firestore().collection('salons').doc(this.$route.params.id).get()
        .then((doc) => {
          this.salon = doc.data()
      })
    },
  }
</script>

<style scoped>
table {
  border-collapse: collapse;
}
table td{
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  width: 90%;
  height: 100%!important;
  min-height: 48px;
}
table th {
  display: block;
  background-color: #eee;
  width: 10%;
  height: auto!important;
  min-height: 48px;
}
@media screen and (max-width: 480px) {
    table th {
      width: 100%;
    }
}
.image {
  width:100%;
}
.message{
   white-space: pre-wrap;
  word-wrap: break-word;
}
.line {
  border-bottom: 8px #1976d2 solid;

}
</style>
