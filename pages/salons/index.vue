<template>
  <v-row
    justify="center"
  >
    <v-col cols="12" md="10">
      <h1>美容室一覧</h1>
      <SalonFormDialog />
      <v-data-table
        :headers="headers"
        :items="salons"
        item-key="name"
        class="elevation-1"
      >
        <template v-slot:item.name="{ item }">
          <div class="d-flex justify-space-between align-center">
            <nuxt-link :to="`/salons/${item.id}`">
              {{ item.salon_name }}
            </nuxt-link>
            <span>
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
              <ConfirmDialog @confirmed="deleteSalon(item.id)">
                <template v-slot:confirmText>
                  「{{ item.salon_name }}」を削除してもよろしいですか？
                </template>
              </ConfirmDialog>
            </span>
          </div>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import firebase from '@/plugins/firebase'
import SalonFormDialog from '~/components/SalonFormDialog.vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

export default {
  components: {
    SalonFormDialog,
    ConfirmDialog
  },
  data () {
    return {
      headers: [
        {
          text: '店舗名',
          align: 'start',
          value: 'name'
        }
      ],
      salons: [],
      listener: null
    }
  },
  mounted () {
    const db = firebase.firestore()
    this.listener = db.collection('salons')
      .onSnapshot((querySnapshot) => {
        this.salons = []
        querySnapshot.forEach((doc) => {
          const salon = Object.assign({ id: doc.id }, doc.data())
          this.salons.push(salon)
        })
      })
  },
  beforeDestroy () {
    this.listener()
  },
  methods: {
    deleteSalon (id) {
      const db = firebase.firestore()
      db.collection('salons').doc(id).delete()
        .then(() => {
          console.log('Document successfully deleted!')
        })
        .catch((e) => {
          console.error('Error removing document: ', e)
        })
    }
  }
}
</script>
