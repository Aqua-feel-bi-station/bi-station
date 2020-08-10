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

      <v-card-text class="pt-2">
        <v-form ref="form">
          <v-text-field
            v-model.trim="fieldData.salon_name"
            :rules="requireNameRules"
            autofocus
          >
            <template v-slot:label>
              店舗名
              <span class="error--text caption">（必須）</span>
            </template>
          </v-text-field>

          <v-text-field
            v-model.trim="fieldData.address"
            :rules="requireNameRules"
            hint="例: 東京都○○区○○ ○○ビル4階"
          >
            <template v-slot:label>
              店舗住所
              <span class="error--text caption">（必須）</span>
            </template>
          </v-text-field>

          <v-text-field
            v-model.trim="fieldData.company_name"
            :rules="requireNameRules"
            hint="例: 株式会社○○"
          >
            <template v-slot:label>
              企業名
              <span class="error--text caption">（必須）</span>
            </template>
          </v-text-field>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="fieldData.establishment_year"
                :rules="numberRules"
                label="設立年"
                hint="例: 2010"
                suffix="年"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="fieldData.establishment_month"
                :rules="numberRules"
                label="設立月"
                hint="1〜12"
                suffix="月"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="fieldData.representative_last"
                :rules="nameRules"
                label="代表者（姓）"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="fieldData.representative_first"
                :rules="nameRules"
                label="代表者（名）"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model.trim="fieldData.capital"
            :rules="nameRules"
            label="資本金"
            hint="例: ○○万"
            suffix="円"
          />

          <v-text-field
            v-model.trim="fieldData.employee_number"
            :rules="numberRules"
            label="従業員数"
            suffix="名"
          />

          <v-text-field
            v-model.trim="fieldData.job_description"
            :rules="nameRules"
            label="業務内容"
            hint="例: 美容室運営"
          />

          <v-text-field
            v-model.trim="fieldData.home_page_url"
            :rules="nameRules"
            label="ホームページURL"
            hint="例: http://example.com"
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
        salon_name: '',
        address: '',
        company_name: '',
        establishment_year: '',
        establishment_month: '',
        representative_last: '',
        representative_first: '',
        capital: '',
        employee_number: '',
        job_description: '',
        home_page_url: ''
      },
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
  watch: {
    dialog (isOpen) {
      if (!isOpen) {
        this.$refs.form.resetValidation()
      } else {
        this.$nextTick(() => {
          this.$vuetify.goTo(0, {
            container: '.v-dialog',
            duration: 0
          })
        })
      }
    }
  },
  mounted () {
    if (this.salon) {
      // そのまま代入すると、一覧画面にも即変更が反映されるため
      this.fieldData = cloneDeep(this.salon)
    }
  },
  methods: {
    onSubmit () {
      if (!this.$refs.form.validate()) { return }

      this.isLoading = true
      const db = firebase.firestore()

      let salonRef
      if (this.salon) {
        salonRef = db.collection('salons').doc(this.salon.id)
      } else {
        salonRef = db.collection('salons').doc()
      }
      salonRef.set(this.fieldData)
        .then(() => {
          if (!this.salon) {
            // this.$refs.form.reset() // 中身がundefinedになってしまう
            this.clearFields()
          }
          this.dialog = false
        })
        .catch((error) => {
          console.error('Error adding document: ', error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    clearFields () {
      for (const key in this.fieldData) {
        this.fieldData[key] = ''
      }
    }
  }
}
</script>
