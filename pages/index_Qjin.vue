<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <v-dialog
          v-model="dialog"
          width="5000"
          fullscreen
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="red lighten-2"
              dark
              v-bind="attrs"
              v-on="on"
            >
              追加
            </v-btn>
          </template>

          <v-card raised width="200" class="ma-2">
            <v-card-title class="headline grey lighten-2">
              募集要項作成
            </v-card-title>

            <v-divider></v-divider>

            <v-card-actions>
              
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
            <v-text-field
              v-model="name"
              :counter="10"
              :rules="nameRules"
              label="店舗名"
              required
            ></v-text-field>

              <v-text-field
                v-model="content"
                :rules="emailRules"
                label="募集職種"
                required
              ></v-text-field>

              <v-select
                v-model="select"
                :items="items"
                :rules="[v => !!v || 'Item is required']"
                label="雇用形態"
                required
              ></v-select>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                作成
              </v-btn>

              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
              リセットする
              </v-btn>

            </v-form>

            </v-card-actions>
          </v-card>
        </v-dialog>
            <tr>
              <th class="text-center">
                店舗名
              </th>
              <th class="text-center">
                募集職種
              </th>
              <th class="text-center">
                雇用形態
              </th>
              <th class="text-center">
                募集要項
              </th>
            </tr>
      </thead>
      <tbody>
        <tr v-for="item in contents" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.payment }}</td>
          <td>{{ item.hire }}</td>
          <td>{{ item.content }}</td>

         <v-col class="text-right" cols="12" sm="4">
            <div class="my-2">
              <v-btn depressed small>編集</v-btn>
            </div>
            <div class="my-2">
              <v-btn depressed small>削除</v-btn>
            </div>
        </v-col>

        </tr>
      </tbody>

　　　 <div class="text-center">
        <v-pagination
          v-model="page"
          :length="6"
        ></v-pagination>
      </div>

    </template>
  </v-simple-table>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      contents: [
        {
          name: 'A',
          payment: 19,
          hire: '正社員,アルバイト',
          content: '中途採用も募集しています',
        },
        {
          name: 'B',
          payment: 59,
          hire: '正社員',
          content: '未経験大歓迎',
        },
        {
          name: 'C',
          payment: 39,
          hire: 'アルバイト',
          content: '経験者大歓迎',
        },
      ]
    }
  }
}
</script>
