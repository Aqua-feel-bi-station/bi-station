<template>
       <div>
              <v-card raised width="200" class="ma-2">
            <v-card-title class="headline grey lighten-2">
              募集要項作成
            </v-card-title>

            <v-divider></v-divider>

            <v-card-actions>
              
            <v-form
              ref="form"
              lazy-validation
            >
　　　　　　　<v-text-field
              v-model.trim="fieldData.top"
              :rules="requireNameRules"
              label="店舗メッセージ"
              required
            ></v-text-field>

            <v-text-field
              v-model.trim="fieldData.name"
              :rules="nameRules"
              label="店舗名"
              required
            ></v-text-field>

            <v-text-field
              v-model.trim="fieldData.need_class"
              :rules="nameRules"
              label="募集内容"
              required
            ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.hire_style"
                :rules="nameRules"
                label="雇用形態"
                required
              ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.content"
                :rules="nameRules"
                label="仕事内容"
                required
              ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.target"
                :rules="nameRules"
                label="対象となる方"
                required
              ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.payment"
                :rules="nameRules"
                label="給与"
                required
              ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.hour"
                :rules="nameRules"
                label="勤務時間"
                required
              ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.welfale"
                :rules="nameRules"
                label="福利厚生"
                required
              ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.holiday"
                :rules="nameRules"
                label="休日"
                required
              ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.place"
                :rules="nameRules"
                label="勤務地"
                required
              ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.access"
                :rules="nameRules"
                label="アクセス"
                required
              ></v-text-field>

              <v-btn
                color="success"
                class="mr-4"
                @click="onSubmit"
              >
                作成
              </v-btn>
            </v-form>
        </v-card-actions>
      </v-card>
    </div>
</template>


<script>

import firebase from '@/plugins/firebase'
import cloneDeep from 'lodash.clonedeep'

const initialContents = {
    top: '',
    name: '',
    need_class: '',
    hire_style: '',
    content: '',
    target: '',
    payment: '',
    hour: '',
    welfare: '',
    holiday: '',
    place: '',
    access: ''
}

export default {
  data () {
    return {
      dialog: false,
      fieldData: { ...initialContents },
      requireNameRules: [
        v => !!v?.trim() || 'この項目は必須です',
        v => v?.length <= 255 || '255文字以内で入力してください'
      ],
      nameRules: [
        v => v?.length <= 255 || '255文字以内で入力してください'
      ],
      numberRules: [
        v => !isNaN(v) || '数字で入力してください'
      ]
    }
  },

  mounted () {
      console.log(this.$route.params)
      firebase.firestore().collection('Qjins').doc(this.$route.params.qjin_id).get()
        .then((doc) => {
          this.fieldData = doc.data()
          // if (doc.exists) {
          // } else {
          //   throw new Error('ページが見つかりません')
          // }
        })
        // .catch((e) => {
        //   error({ statusCode: 404, message: 'ページが見つかりません' })
        // })
    },

methods: {
    onSubmit () {
    //   if (!this.$refs.form.validate()) { return }

    //   this.isLoading = true

      const QjinRef =
        firebase.firestore().collection('Qjins').doc(this.$route.params.qjin_id)

      QjinRef.set(this.fieldData)
        .then(() => {
          this.$router.push('/Qjin') 
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
        //   this.isLoading = false
        })
    }
  }

}
</script>
