<template>
  <div class="wrap">
    <div class="title">
      <div class="logo">
        福颐助老
      </div>
    </div>
    <div class="body">
      <div class="login-box">
        <div class="title">
          欢迎您，请登录
        </div>
        <div class="form">
          <ul>
            <li>
              <label for="account">账号： </label>
                <input type="text" v-model.trim="loginForm.username" id="account" placeholder="请输入账号" />
            </li>
            <li class='pw'>
              <label for="passwd">密码： </label>
              <input type="password" v-model.trim='loginForm.password' @keyup.enter="handleLogin" id="passwd" placeholder="请输密码"/>
              <!-- <span id='forgetPw'>忘记密码?</span> -->
            </li>
          </ul>
          <button id='submit' @click='handleLogin'>登录</button>
        </div>
      </div>
      <div class="find-passwd-box">
        <div class="title">
          <span>找回密码</span>
          <span class="back">返回</span>
        </div>
        <div class="form">
          <ul>
            <li>
              <label for="pwaccount">账号： </label>
                <input type="text" name="account" id="pwaccount" placeholder="请输入账号" />
            </li>
            <li class='auth'>
              <label for="authCode">验证码：</label>
              <input type="text" name="authCode" id="authCode" placeholder="请输验证码"/>
              <span class='auth-code '> 获取验证码</span>
            </li>
            <li>
              <label for="newpasswd">新密码：</label>
              <input type="password" name="newpasswd" id="newpasswd" placeholder="请输密码"/>
            </li>
            <li>
              <label for="confirmpw">确认密码：</label>
              <input type="password" name="confirmpw" id="confirmpw" placeholder="请输密码"/>
            </li>
          </ul>
          <button id='confirm'>确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ERR_OK } from '../../common/config.js'
import storage from 'good-storage'
import { UMS } from '@/common/config'
export default {
  name: 'login',
  data() {
    return {
      loading: false,
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  created () {
    storage.clear()
  },
  methods: {
    handleLogin() {
      if (!this.loginForm.username || !this.loginForm.password) {
        alert('请输入账号和密码!')
      } else {
        let loginForm = ''
        for (let it in this.loginForm) {
          loginForm += encodeURIComponent(it) + '=' + encodeURIComponent(this.loginForm[it]) + '&'
        }
        this.$http.post(`${UMS}/user/verify.login`, loginForm).then(res => {
          if (res.data.errCode === ERR_OK) {
            this.loading = true
            window._dataInfo = res.data.user
            storage.set('role', res.data.roleIds)
            let info = JSON.stringify(res.data.user)
            storage.set('_dataInfo', info)
            this.$store.dispatch('Login', res.data.user).then(() => {
              this.loading = false
              this.$router.push({ path: '/home' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            alert(res.data.errMessage)
            return false
          }
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
   html, body, ul, li, ol, dl, dd, dt, p, h1, h2, h3, h4, h5, h6, form, fieldset, legend, img {
    margin: 0;padding: 0;
  }

  fieldset, img, input, button {
    border: none;
    padding: 0;
    margin: 0;
    outline-style: none;
  }

  ul, ol {
    list-style: none;
  }

  input {
    padding-top: 0;
    padding-bottom: 0;
    font-family: "SimSun", "宋体";
  }

  select, input, button {
    vertical-align: middle;
  }

  select, input, textarea {
    font-size: 12px;
    margin: 0;
  }

  textarea {
    resize: none;
  }

  img {
    border: 0;
    vertical-align: middle;
  }

  body {
    font: 12px/150% Arial, Verdana, "\5b8b\4f53";
    background: #fff;
  }

  table {
    border-collapse: collapse;
  }

  .clearfix:before, .clearfix:after {
    content: "";
    display: table;
  }

  .clearfix:after {
    clear: both;
  }

  .clearfix {
    *zoom: 1;
  }

  a {
    color: #666;
    text-decoration: none;
  }

  h1, h2, h3, h4, h5, h6 {
    text-decoration: none;
    font-weight: normal;
    font-size: 100%;
  }

  s, i, em {
    font-style: normal;
    text-decoration: none;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .al {
    text-align: left;
  }

  .ac {
    text-align: center;
  }

  .ar {
    text-align: right;
  }

  .hide {
    display: none;
  }

  body{
    font-family: "Microsoft YaHei", "微软雅黑",
        "Helvetica Neue", Helvetica, "PingFang SC",
        "Hiragino Sans GB",  Arial, sans-serif;
    min-width: 1366px; 
    min-height: 768px;
  }

  /*登录页样式*/
  // .wrap{
  //   width: 100vw;
  //   height: 100vh;
  // }
  .title{
    width: 100%;
    height: 108px;
    padding: 24px 0 20px 0;
  }
  .title .logo{
    background: url('../../assets/order/logo.png');
    text-indent: -999px;
    width: 170px;
    height: 64px;
    margin-left: 17.6%;
  }

  .body{
    background: url('../../assets/order/bgc.png') no-repeat;
    background-size: cover;
    height: 584px;
    width: 100%;
    position: relative;
  }

  .body .login-box {
    background-size: cover;
    width: 24%;
    height: 70%;
    position: absolute;
    right: 10%;
    top: 44px;
    background-color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    padding-bottom: 20px;
  }

  .body .login-box .title{
    width: 100%;
    height: calc(15.7% - 38px);
    padding-top: 38px;
    padding-left: 32px;
    color: #00a6fc;
    font-size: 22px;
  }

  .body .login-box .form ul{
    padding-left: 22px;
    padding-right:12px;
  }


  .body .login-box .form ul li{
    font-size: 18px;
    color: #3e3e3e;
    margin-top: 45px;
    padding-left: 12px;
    padding-bottom: 14px; 
    border-bottom: 1px solid #EFEFEF;
  }

  .body .login-box .form ul li.pw{
    position: relative;
  }

  .body .login-box .form ul li.pw #forgetPw{
    font-size: 14px;
    color: #B0B0B0;
    position: absolute;
    right: 4px;
    bottom: -27px;
  }

  .body .login-box .form ul li.pw #forgetPw:hover{
    cursor: pointer;
  }

  .body .login-box .form ul li input{
    font-size: 18px;
    color: #B0B0B0;
  }

  .body .login-box .form button{
    width: 80%;
    height: 70px;
    background-color: #00a6fc;
    border-radius:  4px;
    text-align: center;
    margin:70px 10%;
    font-size: 22px;
    color: #fff;
  }

  .body .login-box .form button:hover{
    cursor: pointer;
  }

  .body .find-passwd-box{
    display: none;
    height: 87.5%;
    width: 24%;
    position: absolute;
    right: 10%;
    top: 44px;
    background-color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    padding-bottom: 20px;
  }

  .body .find-passwd-box .title{
    width: calc(100% - 42px);
    height: calc(11% - 28px);
    padding-top: 28px;
    padding-left: 32px;
    padding-right: 10px;
    color: #00a6fc;
    font-size: 22px;
  }

   .body .find-passwd-box .title .back{
     float: right;
     font-size: 16px;
   }

   .body .find-passwd-box .title .back:hover{
     cursor: pointer;
   }


  .body .find-passwd-box .form ul{
    padding-left: 22px;
    padding-right:12px;
  }


  .body .find-passwd-box .form ul li{
    font-size: 18px;
    color: #3e3e3e;
    margin-top: 40px;
    padding-left: 12px;
    padding-bottom: 14px; 
    border-bottom: 1px solid #EFEFEF;
  }

  .body .find-passwd-box .form  ul li.auth{
    position: relative;
  }

  .body .find-passwd-box .form ul li.auth .auth-code{
    font-size: 16px;
    color: #00a6fc;
    position: absolute;
    bottom: 12px;
    right: 2px;
    border: 1px solid #00a6fc;
    border-radius: 4px;
    padding: 2px;
  }

  .body .find-passwd-box .form ul li.auth .auth-code:hover{
    cursor: pointer;
  }


  .body .find-passwd-box .form ul li input{
    font-size: 18px;
    color: #bobobo;
  }

  .body .find-passwd-box .form button{
    width: 80%;
    height: 70px;
    background-color: #00a6fc;
    border-radius:  4px;
    text-align: center;
    margin:50px 10%;
    font-size: 22px;
    color: #fff;
  }

  .body .find-passwd-box .form button:hover{
    cursor: pointer;
  }

  .close{
    background-color: #efefef;
  }

</style>
