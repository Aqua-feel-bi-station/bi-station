<template>
<div>
   <NuxtLink to="salons/aaa/Qjin/new">
          追加
        </NuxtLink>
  <v-simple-table>
    <template v-slot:default>
      <thead>

            <tr>
              <th class="text-center">
                店舗メッセージ
              </th>
              <th class="text-center">
                店舗名
              </th>
              <th class="text-center">
                募集職種
              </th>
              <th class="text-center">
                雇用形態
              </th>
              <th class="text-center">
                募集要項
              </th>
              <th class="text-center">
                募集要項
              </th>
          
            </tr>
      </thead>
      <tbody>
          <tr v-for="item in qjins" :key="item.id">
            <td>
              <NuxtLink :to="`/Qjin/${item.id}`">
                {{ item.top }}
              </NuxtLink>
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.payment }}</td>
          <td>{{ item.hire }}</td>
          <td>{{ item.content }}</td>

         <v-col class="text-right" cols="12" sm="4">
            <div class="my-2">
              <v-btn depressed small :to="`/Qjin/edit/${item.id}`">編集</v-btn>
            </div>
            <div class="my-2">
              <v-btn depressed small　@click="deleteQjin(item.id)">削除</v-btn>
            </div>
        </v-col>

        </tr>
      </tbody>

<!-- 　　　 <div class="text-center">
        <v-pagination
          v-model="page"
          :length="6"
        ></v-pagination>
      </div> -->
    
    </template>
  </v-simple-table>
  </div>
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
