<template>
  <div>
    <h2 class="mb-5 text-h6">求人一覧</h2>

    <v-btn
      class="mb-3"
      color="primary"
      :to="`/salons/${salonId}/Qjin/new`"
    >
      求人を追加
    </v-btn>

    <v-data-table
      :headers="headers"
      :items="qjins"
      class="elevation-1 mt-3"
    >
      <template v-slot:item.title="{ item }">
        <NuxtLink
          class="qjin-link d-flex align-center"
          :to="`/salons/${item.salon_id}/Qjin/${item.id}`"
        >
          {{ item.title }}
        </NuxtLink>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ timestampToDate(item.created_at) }}
      </template>
      <template v-slot:item.buttons="{ item }">
        <span class="d-flex justify-end">
          <v-btn
            color="success"
            class="mr-1"
            :to="`/salons/${salonId}/Qjin/${item.id}/edit`"
          >編集</v-btn>
          <ConfirmDialog @confirmed="deleteQjin(item.id)">
            <template v-slot:confirmText>
              「{{ item.top }}」を削除してもよろしいですか？
            </template>
          </ConfirmDialog>
        </span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

export default {
  name: 'SalonQjins',
  components: {
    ConfirmDialog
  },
  data () {
    return {
      qjins: [],
      headers: [
        {
          text: '求人タイトル',
          value: 'title',
          width: '45%',
          sortable: false
        },
        {
          text: '募集職種',
          value: 'need_class',
          sortable: false
        },
        {
          text: '雇用形態',
          value: 'hire_style',
          sortable: false
        },
        {
          text: '',
          value: 'buttons',
          sortable: false
        }
      ],
      listener: null
    }
  },
  props: {
    salonId: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.listener = firebase.firestore().collection('salons').doc(this.salonId).collection('Qjins')
      .onSnapshot((querySnapshot) => {
        this.qjins = []
        querySnapshot.forEach((doc) => {
          this.qjins.push(doc.data())
        })
      })
  },
  beforeDestroy () {
    this.listener()
  },
  methods: {
    deleteQjin(id) {
      firebase.firestore().collection('salons').doc(this.salonId)
        .collection('Qjins').doc(id).delete()
    }
  }
}
</script>

<style scoped>
.qjin-link {
  width: 100%;
  height: 100%;
}
</style>
