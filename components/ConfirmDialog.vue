<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on }">
      <slot name="button" :on="on">
        <v-btn color="error" v-on="on">
          削除
        </v-btn>
      </slot>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2">
        <slot name="headerText">
          確認
        </slot>
      </v-card-title>

      <v-card-text class="text-subtitle-1 black--text pt-5">
        <slot name="confirmText">
          削除してもよろしいですか？
        </slot>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn @click="closeDialog">
          キャンセル
        </v-btn>
        <v-spacer />
        <v-btn
          color="error"
          @click="onSubmit"
        >
          <slot name="buttonText">
            削除
          </slot>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'ConfirmDialog',
  props: {
    salon: Object
  },
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    onSubmit () {
      this.$emit('confirmed')
      this.closeDialog()
    },
    closeDialog () {
      this.dialog = false
    }
  }
}
</script>
