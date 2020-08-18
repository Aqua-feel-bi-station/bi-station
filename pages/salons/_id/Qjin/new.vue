   <template>
       <v-row justify="center">
    　　  <v-col cols="12" md="8">
          <v-card raised>
            <v-card-title class="headline grey lighten-2">
              募集要項作成
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              
            <v-form
              ref="form"
              lazy-validation
            >
            <v-text-field
              v-model.trim="fieldData.title"
              :rules="requireTitleRules"
              label="求人タイトル"
              required
            ></v-text-field>

　　　　　　　<v-textarea
              v-model.trim="fieldData.message"
              :rules="requireMessageRules"
              label="店舗メッセージ"
              required
            ></v-textarea>

            <v-file-input
            v-model="formFile"
            accept="image/*"
            placeholder="画像を追加する（最大3枚）"
            :rules="imageRules"
            prepend-icon="mdi-camera"
            @change="uploadImage"
          />
          <v-progress-linear
            v-if="percentage !== 0"
            :value="percentage"
          />

            <v-text-field
              v-model.trim="fieldData.name"
              :rules="nameRules"
              label="店舗名"
              required
            ></v-text-field>

            <v-text-field
              v-model.trim="fieldData.need_class"
              :rules="requireNameRules"
              label="募集職種"
              required
            ></v-text-field>

              <v-text-field
                v-model.trim="fieldData.hire_style"
                :rules="requireNameRules"
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

              <v-textarea
                v-model.trim="fieldData.payment"
                :rules="requireNameRules"
                rows="3"
                label="給与"
                required
              ></v-textarea>

              <v-text-field
                v-model.trim="fieldData.hour"
                :rules="requireNameRules"
                label="勤務時間"
                required
              ></v-text-field>

              <v-textarea
                v-model.trim="fieldData.welfale"
                :rules="nameRules"
                label="福利厚生"
                required
              ></v-textarea>

              <v-textarea
                v-model.trim="fieldData.holiday"
                :rules="nameRules"
                label="休日"
                required
              ></v-textarea>

              <v-text-field
                v-model.trim="fieldData.place"
                :rules="requireNameRules"
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
                :loading="isLoading"
              >
                作成
              </v-btn>
            </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>

import firebase from '@/plugins/firebase'
import cloneDeep from 'lodash.clonedeep'

const initialContents = {
    title: '',
    message: '',
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
      salon: {},
      formFile: null,
      imageRules: [
        v => !v || v.size <= 5000000 || '画像のサイズは5MBが上限です'
      ],
      percentage: 0,
      images: [],
      fieldData: { ...initialContents },
      requireTitleRules: [
        v => !!v?.trim() || 'この項目は必須です',
        v => v?.length <= 45 || '45文字以内で入力してください'
      ],
      requireMessageRules: [
        v => !!v?.trim() || 'この項目は必須です',
        v => v?.length <= 4000 || '4000文字以内で入力してください'
      ],
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
    firebase.firestore().collection('salons').doc(this.$route.params.id).get()
      .then((doc) => {
        this.salon = doc.data()
      })
  },

methods: {
    onSubmit () {
      if (!this.$refs.form.validate()) { return }

      this.isLoading = true


      const QjinRef =
        firebase.firestore().collection('salons').doc(this.$route.params.id)
          .collection('Qjins').doc()

      // const imageId = `${this.salon.id}-${file.name}`
      // const storageRef = firebase.storage().ref(`qjin_images/${file.name}`)

      // storageRef.put(file).on('state_changed', //.onは４つ引数とる。自動で１００パーになったら、4番目の処理が始まる。
      //   (snapshot) => { // progress
      //     this.percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //   },

      //   (e) => { // error
      //     console.error(e)
      //   },

      //   () => { // completed
      //     // storageRef.getDownloadURL()
      //     //   .then((url) => {
      //     //     this.$set(this.salon, 'images', { [imageId]: url })
      //     //     return firebase.firestore().collection('salons').doc(this.salon.id).update({
      //     //       images: this.salon.images
      //     //     })
      //     //   })
      //     //   .then(() => {
      //     //     this.percentage = 0
      //     //     this.formFile = null
      //     //     this.$notify('美容室の画像を登録しました')
      //     //   })
      //     //   .catch((e) => {
      //     //     this.$errorNotify()
      //     //     console.error(e)
      //     //   })
      //   }
      // )


      QjinRef.set({
        id: QjinRef.id,
        salon_id: this.$route.params.id,
        salon_images: this.salon.images,
        ...this.fieldData
      })
        .then(() => {
          this.$router.push(`/salons/${this.$route.params.id}/Qjin/${QjinRef.id}`) 
        })
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    uploadImage (file) {
      if (!file || file.size > 5000000) { return }

      this.images.push(file)

    },
    deleteImage (imageId) {
      firebase.storage().ref(`salon_images/${imageId}`).delete()
        .then(() => {
          this.$delete(this.salon.images, imageId)
          return firebase.firestore().collection('salons').doc(this.salon.id).update({
            images: this.salon.images
          })
        })
        .then(() => {
          this.$notify('美容室の画像を1枚削除しました')
        })
        .catch((e) => {
          this.$errorNotify()
          console.error(e)
        })
    },
  }
}
</script>
