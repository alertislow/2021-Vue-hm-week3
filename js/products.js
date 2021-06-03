// ESM 載入 
// Vue3 esm.cdn
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const App = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      path: 'dogezad',
      products: [],
      tempProduct: {   // 修改產品時的預設結構
        imagesUrl: [],
      },
    }
  },
  // 取得資料以及抓到DOM元素會在 mounted 執行
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;

    this.getProduct();
  },
  methods: {
    getProduct() {
      const url = `${this.apiUrl}/${this.path/admin/products}`
      axios.get(url)
        .then(res =>{
          console.log(res);
          if(res.data.success) {
            this.products = res.data.products;
          }else {
            alert('res.data.message');
          }
        })
    },
    // 刪除產品
    delProduct() {
      const id = e.target.dataset.id;
      axios.delete(`${this.apiUrl}/api/${this.path}/admin/product/${id}`)
    }
  },
});

App.mount('#app');