<template>
  <ConfirmDialog @confirmed="deleteSalon">
    <template v-slot:confirmText>
      「{{ salon.salon_name }}」を削除してもよろしいですか？
    </template>
  </ConfirmDialog>
</template>

<script>
import firebase from '@/plugins/firebase'
import ConfirmDialog from '~/components/ConfirmDialog.vue'

export default {
  name: 'SalonDeleteConfirm',
  components: {
    ConfirmDialog
  },
  props: {
    salon: {
      type: Object,
      required: true
    }
  },
  methods: {
    deleteSalon () {
      const imageIds = Object.keys(this.salon.images || {})
      firebase.firestore().collection('salons').doc(this.salon.id).delete()
        .then(() => {
          imageIds.forEach((imageId) => {
            firebase.storage().ref(`salon_images/${imageId}`).delete()
          })
          this.$emit('delete-salon')
          this.$notify('美容室情報を削除しました')
        })
        .catch((e) => {
          this.$errorNotify()
          console.error(e)
        })
    }
  }
}
</script>
