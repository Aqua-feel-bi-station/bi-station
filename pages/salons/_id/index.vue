<template>
  <v-row
    justify="center"
  >
    <v-col cols="12" md="10">
      <h1 class="text-h5 mb-3">{{ salon.salon_name }}</h1>
      <div class="text-right">
        登録日: {{ salonCreatedAt }}
      </div>
      <v-simple-table class="mt-2 elevation-1">
        <template v-slot:default>
          <tbody>
            <tr v-for="item in salonItems" :key="item.label">
              <td>
                <v-row>
                  <v-col cols="12" sm="4">
                    <span class="font-weight-bold">{{ item.label }}</span>
                  </v-col>
                  <v-col cols="12" sm="8">
                    <span>{{ item.data }}</span>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <div class="text-right mt-4">
        <SalonFormDialog
          :salon="salon"
          @update-salon="updateSalon"
        >
          <template v-slot:button="{ on }">
            <v-btn color="success" v-on="on">
              編集
            </v-btn>
          </template>
          <template v-slot:headerText>
            美容室情報編集
          </template>
          <template v-slot:submitText>
            更新する
          </template>
        </SalonFormDialog>
        <SalonDeleteConfirm
          :salon="salon"
          @delete-salon="deleteSalon"
        />
      </div>

      <div class="mt-5">
        <h3 class="text-h6">美容室の画像</h3>
        <v-file-input
          v-model="formFile"
          accept="image/*"
          placeholder="画像を追加する（最大3枚）"
          :rules="imageRules"
          :disabled="imagesCount >= 3"
          prepend-icon="mdi-camera"
          @change="uploadImage"
        />
        <v-progress-linear
          v-if="percentage"
          :value="percentage"
        />
        <v-card
          class="d-flex flex-wrap"
        >
          <span v-for="(url, id) in salon.images" :key="id">
            <span class="image-span mt-2 ml-2">
              <img :src="url" class="image">
            </span>
            <v-btn small icon @click="deleteImage(id)">
              <v-icon >mdi-close-circle-outline</v-icon>
            </v-btn>
          </span>
        </v-card>
      </div>

      <div class="text-right pt-8">
        <v-btn to="/salons">戻る</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import firebase from '@/plugins/firebase'
import cloneDeep from 'lodash.clonedeep'
import SalonFormDialog from '~/components/SalonFormDialog.vue'
import SalonDeleteConfirm from '~/components/SalonDeleteConfirm.vue'

export default {
  name: 'SalonShow',
  components: {
    SalonFormDialog,
    SalonDeleteConfirm
  },
  asyncData ({ params, error }) {
    return firebase.firestore().collection('salons').doc(params.id).get()
      .then((doc) => {
        if (doc.exists) {
          return { salon: doc.data() }
        } else {
          throw new Error('ページが見つかりません')
        }
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'ページが見つかりません' })
      })
  },
  data () {
    return {
      formFile: null,
      imageRules: [
        v => !v || v.size <= 5000000 || '画像のサイズは5MBが上限です'
      ],
      percentage: 0
    }
  },
  computed: {
    salonItems () {
      const unregistered = '(未登録)'
      return [
        {
          label: '店舗名',
          data: this.salon.salon_name
        },
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
    imagesCount () {
      return this.salon.images ? Object.keys(this.salon.images).length : 0
    },
    salonCreatedAt () {
      // toDate()ではエラーが発生したため
      return this.$dayjs(this.salon.created_at.seconds * 1000).format('YYYY年MM月DD日')
    }
  },
  methods: {
    uploadImage (file) {
      if (!file || file.size > 5000000 || this.imagesCount >= 3) { return }

      const imageId = `${this.salon.id}-${file.name}`
      const storageRef = firebase.storage().ref(`salon_images/${imageId}`)

      storageRef.put(file).on('state_changed',
        (snapshot) => { // progress
          const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          this.percentage = percentage
        },

        (e) => { // error
          console.error(e)
        },

        () => { // completed
          storageRef.getDownloadURL()
            .then((url) => {
              this.$set(this.salon, 'images', { [imageId]: url })
              return firebase.firestore().collection('salons').doc(this.salon.id).update({
                images: this.salon.images
              })
            })
            .then(() => {
              this.percentage = 0
              this.formFile = null
              this.$notify('美容室の画像を登録しました')
            })
            .catch((e) => {
              this.$errorNotify()
              console.error(e)
            })
        }
      )
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
    updateSalon () {
      firebase.firestore().collection('salons').doc(this.salon.id).get()
        .then((doc) => {
          this.salon = doc.data()
        })
        .catch((e) => {
          this.$errorNotify()
          console.error(e)
        })
    },
    deleteSalon () {
      this.$router.push('/salons')
    }
  }
}
</script>

<style scoped>
.image-span {
  display: inline-block;
  height: 200px;
}
.image {
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
