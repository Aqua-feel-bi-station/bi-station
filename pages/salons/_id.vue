<template>
  <v-row
    justify="center"
  >
    <v-col cols="12" md="10">
      <h1>{{ salon.salon_name }}</h1>
      <v-simple-table class="mt-3 elevation-1">
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

      <div class="text-right my-2">
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
        <v-file-input
          v-model="formFile"
          accept="image/*"
          placeholder="美容室の画像を追加する"
          :rules="imageRules"
          show-size
          prepend-icon="mdi-camera"
          @change="uploadImage"
        />
        <v-progress-linear
          v-if="percentage"
          :value="percentage"
        />
        <v-card
          class="d-flex"
        >
          <span v-for="(url, id) in salon.images" :key="id">
            <span class="image-span mt-2 ml-2">
              <img :src="url" class="image">
            </span>
            <v-btn small icon @click="deleteImage(id)">
              <v-icon small>mdi-close-circle-outline</v-icon>
            </v-btn>
          </span>
        </v-card>
      </div>

      <div class="text-right py-5">
        <NuxtLink to="/salons">
          戻る
        </NuxtLink>
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
          data: `${this.salon.establishment_year}年${this.salon.establishment_month}月`
        },
        {
          label: '代表者',
          data: `${this.salon.representative_last} ${this.salon.representative_first}`
        },
        {
          label: '資本金',
          data: `${this.salon.capital}円`
        },
        {
          label: '従業員数',
          data: `${this.salon.employee_number} 名`
        },
        {
          label: '業務内容',
          data: this.salon.job_description
        },
        {
          label: 'ホームページURL',
          data: this.salon.home_page_url
        }
      ]
    }
  },
  methods: {
    uploadImage (file) {
      if (!file || file.size > 5000000) { return }

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
              const updatedImages = {
                ...this.salon.images,
                [imageId]: url
              }

              this.salon.images = updatedImages
              return firebase.firestore().collection('salons').doc(this.salon.id).update({
                images: updatedImages
              })
            })
            .then(() => {
              this.percentage = 0
              this.formFile = null
            })
            .catch((e) => {
              console.error(e)
            })
        }
      )
    },
    deleteImage (imageId) {
      firebase.storage().ref(`salon_images/${imageId}`).delete()
        .then(() => {
          const remainingImages = cloneDeep(this.salon.images)
          delete remainingImages[imageId]

          return firebase.firestore().collection('salons').doc(this.salon.id).update({
            images: remainingImages
          })
        })
        .then(() => {
          this.$delete(this.salon.images, imageId)
        })
        .catch((e) => {
          console.error(e)
        })
    },
    updateSalon () {
      firebase.firestore().collection('salons').doc(this.salon.id).get()
        .then((doc) => {
          this.salon = doc.data()
        })
        .catch((e) => {
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
  height: 160px;
}
.image {
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
