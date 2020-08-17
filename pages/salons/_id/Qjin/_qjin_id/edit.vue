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
                v-model.trim="fieldData.payment"
                :rules="nameRules"
                label="給与"
                required
              ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.hire"
                :rules="nameRules"
                label="雇用"
                required
              ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.content"
                :rules="nameRules"
                label="仕事内容"
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
    payment: '',
    hire: '',
    content: '',
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
