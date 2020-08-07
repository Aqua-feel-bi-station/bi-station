<template>
  <div class="page">
    <label>
      <span>
        お名前:
      </span>
      <input
        v-model="user.name"
        type="text"
      >
    </label>
    <label>
      <span>
        email:
      </span>
      <input
        v-model="user.email"
        type="text"
      >
    </label>
    <button
      type="button"
      @click="submit"
    >
      Submit
    </button>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data () {
    return {
      user: {
        name: '',
        email: ''
      }
    }
  },
  methods: {
    submit () {
      const db = firebase.firestore()
      const dbUsers = db.collection('users')
      dbUsers
        .add({
          name: this.user.name,
          email: this.user.email
        })
        .then((ref) => {
          console.log('Add ID: ', ref.id)
        })
    }
  }
}
</script>
