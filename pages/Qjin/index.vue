<template>
  <v-row justify="center">
    <v-col cols="12" md="10">
      <h1 class="mb-7 text-h4">求人情報一覧</h1>
      <v-card
        v-for="qjin in qjins"
        :key="qjin.id"
        class="mb-8 pb-3"
      >
        <v-card-title class="primary white--text">
          <v-list-item>
            <v-list-item-content class="py-1">
              <div>
                <NuxtLink
                  class="text-subtitle-2 text-md-h6 white--text font-weight-bold text-decoration-none title-link"
                  :to="`/salons/${qjin.salon_id}/Qjin/${qjin.id}`"
                >
                  {{ qjin.title }}
                </NuxtLink>
              </div>
              <v-list-item-subtitle class="white--text mt-2">
                {{ qjin.name }} / {{ qjin.need_class}} {{ qjin.hire_style }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
        <v-card-text class="pt-5">
          <v-row>
            <v-col cols="12" md="5" class="d-flex justify-center align-center">
              <span class="image-span">
                <img
                  class="image"
                  :src="salonImageURL(qjin)"
                />
              </span>
            </v-col>
            <v-col cols="12" md="7">
              <v-row
                v-for="item in qjinItems(qjin)"
                :key="item.label"
              >
                <v-col cols="4" sm="3" class="d-flex justify-center align-center">
                  <v-chip outlined color="primary" class="text-center">
                    <span style="width: 80px">{{ item.label }}</span>
                  </v-chip>
                </v-col>
                <v-col cols="8" sm="9" class="d-flex align-center black--text">
                  {{ item.data }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            :to="`/salons/${qjin.salon_id}/Qjin/${qjin.id}`"
            color="primary"
            x-large
            width="180"
          >
            求人情報詳細へ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data () {
    return {
      qjins: []
    }
  },
  computed: {
    salonImageURL () {
      return (qjin) => {
        return Object.values(qjin.salon_images || {})[0]
      }
    },
    qjinItems () {
      return (qjin) => {
        return [
          {
            label: '募集職種',
            data: qjin.need_class
          },
          {
            label: '雇用形態',
            data: qjin.hire_style
          },
          {
            label: '給与',
            data: qjin.payment
          },
          {
            label: '勤務地',
            data: qjin.place
          },
          {
            label: '勤務時間',
            data: qjin.hour
          },
        ]
      }
    }
  },
  mounted () {
    firebase.firestore().collectionGroup('Qjins').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.qjins.push(doc.data())
        })
      })
  }
}
</script>

<style scoped>
.image-span {
  display: inline-block;
}
.image {
  max-height: 270px;
  max-width: 100%;
}
.title-link:hover {
  opacity: 0.8;
}
</style>
