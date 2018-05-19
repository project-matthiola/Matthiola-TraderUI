<template>
  <div class="register_page fillcontain">
    <transition class="form-fade" mode="in-out">
      <section class="form_container" v-show="showRegister">
        <div class="manage_tip">
          <p>Register</p>
        </div>
        <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm">
          <el-form-item label="Username" prop="username">
            <el-input type="text" v-model="registerForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="registerForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="Confirm Password" prop="checkPassword">
            <el-input type="password" v-model="registerForm.checkPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('registerForm')">Register</el-button>
            <el-button @click="resetForm('registerForm')">Reset</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
import { requestRegister } from '../common/api'

export default {
  name: 'Register',
  data () {
    let checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Please input sername'));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input password'));
      } else {
        if (this.registerForm.checkPassword !== '') {
          this.$refs.registerForm.validateField('checkPassword');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input confirm password'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('Two passwords not match!'));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        username: '',
        password: '',
        checkPassword: ''
      },
      rules: {
        username: [
          { validator: checkUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      showRegister: false
    }
  },
  mounted () {
    this.showRegister = true;
    this.$refs['registerForm'].resetFields();
  },
  created () {
    document.title = 'Register'
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let registerForm = {
            'traderName': this.registerForm.username,
            'password': this.registerForm.password
          };
          requestRegister(registerForm).then((res) => {
            console.log(res);
            if (res.status === 200 && res.data.status === 200) {
              this.$message({
                message: 'Register success!',
                type: 'success'
              });
              this.$router.push('/login');
            } else {
              this.$message.error('Username duplicate!');
              this.$refs[formName].resetFields();
            }
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
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../style/mixin";
  .register_page {}
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
    .wh(320px, 350px);
    .ctp(320px, 350px);
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
