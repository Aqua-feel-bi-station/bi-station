<template>
  <v-row justify="center">
    <v-col cols="12" md="10">
      <h1 class="mb-5 text-h5">求人票一覧</h1>
    </v-col>
  </v-row>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data () {
    return {
      qjins: [],
      listener: null
    }
  },
  mounted () {
    this.listener = firebase.firestore().collection('Qjins')
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
      firebase.firestore().collection('Qjins').doc(id).delete()
    }
  }
}
</script>
