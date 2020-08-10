<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on }">
      <slot name="button" :on="on">
        <v-btn color="primary" v-on="on">
          追加
        </v-btn>
      </slot>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2">
        <slot name="headerText">
          美容室情報登録
        </slot>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model.trim="fieldData.salonName"
            :rules="requireNameRules"
            label="店舗名"
          />
          <v-text-field
            v-model.trim="fieldData.companyName"
            :rules="requireNameRules"
            label="企業名"
            placeholder="株式会社○○"
          />
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="fieldData.establishmentYear"
                :rules="numberRules"
                label="設立年"
                placeholder="20XX"
                suffix="年"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="fieldData.establishmentMonth"
                :rules="numberRules"
                label="設立月"
                placeholder="1"
                suffix="月"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="fieldData.representativeLast"
                :rules="nameRules"
                label="代表者（姓）"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="fieldData.representativeFirst"
                :rules="nameRules"
                label="代表者（名）"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model.trim="fieldData.capital"
            :rules="nameRules"
            label="資本金"
            placeholder="○○万"
            suffix="円"
          />
          <v-text-field
            v-model.trim="fieldData.employeeNumber"
            :rules="numberRules"
            label="従業員数"
            suffix="名"
          />
          <v-text-field
            v-model.trim="fieldData.jobDescription"
            :rules="nameRules"
            label="業務内容"
            placeholder="美容室運営"
          />
          <v-text-field
            v-model.trim="fieldData.homePageUrl"
            :rules="nameRules"
            label="ホームページURL"
            placeholder="http://example.com"
          />
          <v-text-field
            v-model.trim="fieldData.headquarters"
            :rules="requireNameRules"
            label="本社住所"
            placeholder="東京都○○区○○ ○○ビル4階"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="isLoading"
          @click="onSubmit"
        >
          <slot name="submitText">
            登録する
          </slot>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from '@/plugins/firebase'
import cloneDeep from 'lodash.clonedeep'

export default {
  props: {
    salon: Object
  },
  data () {
    return {
      dialog: false,
      isLoading: false,
      fieldData: {
        salonName: '',
        companyName: '',
        establishmentYear: '',
        establishmentMonth: '',
        representativeLast: '',
        representativeFirst: '',
        capital: '',
        employeeNumber: '',
        jobDescription: '',
        homePageUrl: '',
        headquarters: ''
      },
      requireNameRules: [
        v => !!v || 'この項目は必須です',
        v => (v && v.length <= 255) || '255文字以内で入力してください'
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
    if (this.salon) {
      // そのまま代入すると、一覧画面にも即変更が反映されるため
      this.fieldData = cloneDeep(this.salon)
    }
  },
  methods: {
    async onSubmit () {
      if (!this.$refs.form.validate()) { return }

      this.isLoading = true
      const db = firebase.firestore()
      let salonRef
      if (this.salon) {
        salonRef = db.collection('salons').doc(this.salon.id)
      } else {
        salonRef = db.collection('salons').doc()
      }
      await salonRef.set(this.fieldData)
        .then(() => {
          this.dialog = false
          if (!this.salon) {
            this.$refs.form.reset()
          }
        })
        .catch((error) => {
          console.error('Error adding document: ', error)
        })
      this.isLoading = false
    }
  }
}
</script>
