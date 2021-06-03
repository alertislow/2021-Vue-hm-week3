// ESM 載入 
// Vue3 esm.cdn
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = {}; // 定義接近痊愈變數，以利在 mounted 呼叫
let delProductModal = {};

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      path: 'dogezad',
      products: [],
      isNew: false, // 判斷點擊的是編輯還是建立按鈕
      tempProduct: {   // 修改產品時的預設結構
        imagesUrl: [],
      },
    }
  },
  // 取得資料以及抓到DOM元素會在 mounted 執行
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token;

    // Bootstrap 實體
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    // productModal.show();
    this.getProduct();
  },
  methods: {
    getProduct() {
      const url = `${this.apiUrl}/api/${this.path}/admin/products`;
      axios.get(url)
        .then(res =>{
          console.log('取得產品列表',res);
          if(res.data.success) {
            this.products = res.data.products;
          }else {
            alert(res.data.message);
          }
        })
    },
    // 修改以及建立商品的 Modal
    modalProduct(isNew,item) {
      this.isNew = isNew;
      if(this.isNew === 'new') {
        this.tempProduct = {  // 把建立產品、修改產品的暫存列表清空
          // imagesUrl : [],
        };
        productModal.show();
      } else if(this.isNew ==='edit'){
        // this.tempProduct = item; 傳參考性質會使他自行更改資料內的內容
        this.tempProduct = {...item}; // 使用淺層拷貝改善
        productModal.show();
      } else if (this.isNew === 'del') {
        this.tempProduct = {...item};
        delProductModal.show();
      }
    },
    // 新增陣列圖片
    createImages() {
      this.tempProduct.imagesUrl = [
        ''
      ]
    },
    // 更新產品Modal的內容，取得後更新產品列表以及關閉Modal
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.path}/admin/product`
      let method = 'post';
      // 修改後的更新
      if (this.isNew === 'edit'){
        url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`
        method = 'put';
      }
      // 資料要用 "data{}" 包起來
      // []能以變數的方式取到值，object的屬性一律是字串
      axios[method](url,{data: this.tempProduct})
        .then(res=>{
          if (res.data.success){
            this.getProduct();
            productModal.hide();
          }
          console.log(res);
        })
    },
    // 刪除產品   
    delProduct() {
      const url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`
      axios.delete(url)
        .then(res =>{
          console.log('刪除結果',res)
          if(res.data.success){
            alert(res.data.message);
            delProductModal.hide();
            this.getProduct();
          } else {
            alert(res.data.message);
          }
        });
    }
  },
});

app.mount('#app');