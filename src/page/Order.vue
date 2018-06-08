<template>
  <div>
    <el-container>
      <el-header class="header">
        <Header></Header>
      </el-header>
      <el-container>
        <!--<el-aside class="aside2">-->
        <el-aside v-bind:class="{'aside': changeMainClass, 'aside3': true}">
          <NavMenu></NavMenu>
        </el-aside>
        <el-container>
          <el-main v-bind:class="{ 'main-notCollapse': true}">
            <template>
              <el-row>
                <el-col :span="24">
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/myOrder' }">My Order</el-breadcrumb-item>
                  </el-breadcrumb>
                </el-col>
              </el-row>
            </template>
            <div style="padding-top: 20px">
              <el-cascader :options="futuresCascader" v-model="selectedFutures"
                           size="small" placeholder="Select futures" :show-all-levels="false"
                           @change="handleChange" style="float: left; padding-left: 10px"></el-cascader>
              <el-select v-model="selectedStatus" placeholder="Select status" size="small" style="float: left; padding-left: 20px">
                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-button type="primary" plain size="small" @click="doFilter"
                         style="width: 80px; float: left; margin-left: 40px"><i class="el-icon-search"></i>  Filter</el-button>
            </div>
            <template>
              <el-table :data="myOrders" style="width: 100%; text-align: left" stripe
                        highlight-current-row height="450px" size="small" v-loadin="listLoading">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand" size="small">
                      <el-form-item label="Futures">
                        <span>{{ props.row.futures_id }}</span>
                      </el-form-item>
                      <el-form-item label="Order Type">
                        <span>{{ props.row.order_type }}</span>
                      </el-form-item>
                      <el-form-item label="Side">
                        <span>{{ props.row.side }}</span>
                      </el-form-item>
                      <el-form-item label="Quantity">
                        <span>{{ props.row.quantity }}</span>
                      </el-form-item>
                      <el-form-item label="Open Quantity" v-if="props.row.order_type!=='market'">
                        <span>{{ props.row.open_quantity }}</span>
                      </el-form-item>
                      <el-form-item label="Price">
                        <span>{{ props.row.price }}</span>
                      </el-form-item>
                      <el-form-item label="Status">
                        <span>{{ props.row.status }}</span>
                      </el-form-item>
                      <el-form-item label="Created At">
                        <span>{{ props.row.created_at }}</span>
                      </el-form-item>
                      <el-form-item label="Updated At">
                        <span>{{ props.row.updated_at }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="Order ID" prop="order_id" width="350"></el-table-column>
                <el-table-column label="Futures" prop="futures_id" width="120"></el-table-column>
                <el-table-column label="Order Type" prop="order_type" width="120"></el-table-column>
                <el-table-column label="Side" prop="side" width="100"></el-table-column>
                <el-table-column label="Quantity" prop="quantity" width="100"></el-table-column>
                <el-table-column label="Open Quantity" prop="open_quantity" width="110"></el-table-column>
                <el-table-column label="Status" prop="status" width="120"></el-table-column>
                <el-table-column label="Operation" width="110">
                  <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="handleCancel(scope.$index, scope.row)"
                               v-if="scope.row.status==='new'||scope.row.status==='partially_filled'">Cancel</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <template>
              <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
                             layout="prev, pager, next" :total="100">
              </el-pagination>
            </template>
          </el-main>
        </el-container>
      </el-container>
      <el-footer class="footer">
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import NavMenu from '@/components/NavMenu'
import Footer from '@/components/Footer'
import { requestFuturesCascader, requestOrderList, cancelOrder } from '@/common/api'

export default {
  name: 'Order',
  components: {
    Header, NavMenu, Footer
  },
  created () {
    document.title = 'My Order';
    this.$store.state.isCollapse = true
  },
  data () {
    return {
      ws: null,
      listLoading: false,
      currentPage: 1,
      statusList: [
        {value: '-1', label: 'ALL'},
        {value: 'A', label: 'PENDING'},
        {value: '0', label: 'NEW'},
        {value: '1', label: 'PARTIALLY'},
        {value: '2', label: 'FILLED'},
        {value: '3', label: 'CANCELED'},
        {value: '8', label: 'REJECTED'}
      ],
      selectedStatus: '-1',
      futuresCascader: [],
      selectedFutures: [],
      myOrders: [
        { order_id: 'D4CA73A0-FE34-4B09-991F-E889813B1C15',
          order_type: 'limit',
          side: 'buy',
          futures_id: 'GC_SEP18',
          trader_name: 'John',
          quantity: 50,
          open_quantity: 40,
          price: 30.12,
          status: 'new',
          created_at: '2018-05-17T12:00:00Z',
          updated_at: '2012-05-17T13:00:00Z'
        },
        { order_id: 'D4CA73A0-FE34-4B09-991F-E889813B1C15',
          order_type: 'market',
          side: 'buy',
          futures_id: 'GC_SEP18',
          trader_name: 'John',
          quantity: 50,
          open_quantity: 40,
          price: 30.12,
          status: 'canceled',
          created_at: '2018-05-17T12:00:00Z',
          updated_at: '2012-05-17T13:00:00Z'
        },
        { order_id: 'D4CA73A0-FE34-4B09-991F-E889813B1C15',
          order_type: 'stop',
          side: 'buy',
          futures_id: 'GC_SEP18',
          trader_name: 'John',
          quantity: 50,
          open_quantity: 40,
          price: 30.12,
          status: 'partially_filled',
          created_at: '2018-05-17T12:00:00Z',
          updated_at: '2012-05-17T13:00:00Z'
        }
      ],
      orderForm: {}
    }
  },
  computed: {
    changeMainClass () {
      return !this.$store.state.isCollapse;
    }
  },
  mounted () {
    let cascaderParams = {};
    requestFuturesCascader(cascaderParams).then((res) => {
      if (res.status === 200 && res.data.status === 200) {
        this.futuresCascader = res.data.data;
      }
    });
    this.listLoading = true;
    let initRequestParams = {
      'futuresID': 'null',
      'status': '-1',
      'page': '1'
    };
    requestOrderList(initRequestParams).then((res) => {
      if (res.status === 200 && res.data.status === 200) {
        this.myOrders = res.data.data;
        this.listLoading = false;
      }
    });
  },
  methods: {
    doFilter () {
      let filterParams = {
        'futuresID': this.selectedFutures[1],
        'status': this.selectedStatus,
        'page': '1'
      };
      this.listLoading = true;
      requestOrderList(filterParams).then((res) => {
        if (res.status === 200 && res.data.status === 200) {
          this.myOrders = res.data.data;
        }
        this.listLoading = false;
      });
    },
    handleCancel (index, row) {
      this.$confirm('Are you sure to cancel?', 'cancel', {
        type: 'warning'
      }).then(() => {
        let tmp = Object.assign({}, row);
        this.orderForm.orderID = tmp.order_id;
        this.orderForm.futureID = tmp.futures_id;
        let cancelParams = Object.assign({}, this.orderForm);
        console.log(cancelParams);
        cancelOrder(cancelParams).then((res) => {
          if (res.status === 200 && res.data.status === 200) {
            this.$message({
              message: 'Submit request success!',
              type: 'success'
            });
          } else {
            this.$message.error('Submit request fail');
          }
        }).catch((err) => {
          console.log(err);
        });
      });
    },
    handleChange (value) {
      console.log(this.selectedFutures[1]);
      console.log(this.selectedStatus);
    },
    handleCurrentChange (val) {
      console.log(val);
      this.currentPage = val;
      let params = {
        'futuresID': this.selectedFutures[1],
        'status': this.selectedStatus,
        'page': this.currentPage
      };
      this.listLoading = true;
      requestOrderList(params).then((res) => {
        if (res.status === 200 && res.data.status === 200) {
          this.myOrders = res.data.data;
        }
        this.listLoading = false;
      });
    }
  }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 120px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
