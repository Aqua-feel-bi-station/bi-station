<template>
  <v-row
    justify="center"
  >
    <v-col cols="12" md="10">
      <h1 class="mb-2">美容室一覧</h1>
      <SalonFormDialog />

      <v-data-table
        :headers="headers"
        :items="salons"
        class="elevation-1 mt-3"
      >
        <template v-slot:item.name="{ item }">
          <nuxt-link :to="`/salons/${item.id}`" class="table-link d-flex align-center">
            {{ item.salon_name }}
          </nuxt-link>
        </template>
        <template v-slot:item.buttons="{ item }">
          <span class="d-flex justify-end">
            <span class="mr-2">
              <SalonFormDialog :salon="item">
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
            </span>
            <span>
              <SalonDeleteConfirm :salon="item" />
            </span>
          </span>
        </template>
      </v-data-table>

    </v-col>
  </v-row>
</template>

<script>
import firebase from '@/plugins/firebase'
import SalonFormDialog from '~/components/SalonFormDialog.vue'
import SalonDeleteConfirm from '~/components/SalonDeleteConfirm.vue'

export default {
  components: {
    SalonFormDialog,
    SalonDeleteConfirm
  },
  data () {
    return {
      headers: [
        {
          text: '店舗名',
          value: 'name',
          width: '65%',
          sortable: false
        },
        {
          text: '',
          value: 'buttons',
          sortable: false
        }
      ],
      salons: [],
      listener: null
    }
  },
  mounted () {
    console.log(firebase.firestore().collection('salons'))
    this.listener = firebase.firestore().collection('salons')
      .onSnapshot((querySnapshot) => {
        this.salons = []
        querySnapshot.forEach((doc) => {
          this.salons.push(doc.data())
        })
      })
  },
  beforeDestroy () {
    this.listener()
  }
}
</script>

<style scoped>
.table-link {
  width: 100%;
  height: 100%;
}
</style>
