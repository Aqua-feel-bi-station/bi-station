<template>
<div>
<v-simple-table>
  <template v-slot:default>
      <tbody>
        <tr class="d-sm-flex" v-for="item in contents" :key="item.name">
          <th>{{ item.name }}</th>
          <td>{{ item.title }}</td>
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
  export default {
    data () {
      return {
        contents: [
          {
            name: '店舗名',
            title: 'Bee-ms HAIR 名駅'
          },
          {
            name: '募集職種',
            title: 'スタイリスト'
          },
          {
            name: '雇用形態',
            title: '正社員'
          },
           {
            name: '仕事内容',
            title: `カット、カラー、シャンプー、ブロー、パーマ
                    などの施術を行い、ヘアスタイルを作り上げる`
          },
           {
            name: '対象となる方',
            title: '美容師免許'
          },
          {
            name: '勤務時間',
            title: `10:00〜20:00

            【正社員】フルタイム勤務
            【準社員】フルタイムより1時間～2時間短い勤務`
          },
        ],
      }
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