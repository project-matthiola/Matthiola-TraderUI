<template>
  <div class="login_page fillcontain">
    <transition class="form-fade" mode="in-out">
      <section class="form_container" v-show="showLogin">
        <div class="manage_tip">
          <p>Login</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item label="Username" prop="username">
            <el-input type="text" v-model="loginForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">Login</el-button>
            <el-button @click="resetForm('loginForm')">Reset</el-button>
            <el-button type="success" @click="gotoRegister">Register</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
import { requestLogin } from '../common/api'

export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' }
        ]
      },
      showLogin: false
    }
  },
  beforeRouteUpdate () {
    this.$refs['loginForm'].resetFields();
  },
  mounted () {
    this.showLogin = true;
    this.$refs['loginForm'].resetFields();
  },
  created () {
    document.title = 'Login'
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let loginParams = {
            'traderName': this.loginForm.username,
            'password': this.loginForm.password
          };
          requestLogin(loginParams).then((res) => {
            console.log(res);
            if (res.status === 200 && res.data.status === 200) {
              this.$message({
                message: 'Login success!',
                type: 'success'
              });
              let token = res.data.data;
              // let expire = res.data.message;
              sessionStorage.setItem('logintime', new Date().getTime().toString());
              sessionStorage.setItem('token', token);
              sessionStorage.setItem('username', this.loginForm.username);
              if (this.$route.query.redirect) {
                let redirect = this.$route.query.redirect;
                this.$router.push(redirect);
              } else {
                this.$router.push('/catalog');
              }
            }
          }).catch((err) => {
            console.log(err);
          });
        } else {
          this.$message({
            message: 'Please input username and password!',
            type: 'warning'
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    gotoRegister () {
      this.$router.push('/register');
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../style/mixin";
  .login_page {}
  .manage_tip{
    position: absolute;
    width: 100%;
    top: -100px;
    left: 0;
    p{
      font-size: 34px;
      color: #555555;
    }
  }
  .form_container {
    .wh(320px, 250px);
    .ctp(320px, 250px);
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #f9f9f9;
    border-style: solid;
    border-width: 0.3px;
    border-color: black;
    box-shadow: 10px 10px 5px #888888;
    .submit_btn{
      width: 100%;
      font-size: 16px;
    }
  }
  .tip{
    font-size: 12px;
    color: red;
  }
  .form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
  }
  .form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }

</style>
