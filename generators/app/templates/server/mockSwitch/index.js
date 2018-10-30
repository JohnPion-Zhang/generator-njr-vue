new Vue({
  el: '#app',
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    axios.post('/mock-switch/list')
      .then(res => {
        const data = res.data
        data[0].selections.forEach(item => {
          item.value = item.value.replace(/\s/g, '')
        })
        data[0].status = data[0].selections[0].value
        this.tableData = data
      })
  },
  methods: {
    changeHandle(row) {
      axios.post('/mock-switch', {
        key: row.url,
        value: row.status
      })
    }
  }
})