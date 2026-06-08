<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Login</h2>
      <a-form :model="form" @submit="handleSubmit">
        <a-form-item label="Username" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-input v-model:value="form.username" placeholder="Enter username" />
        </a-form-item>
        <a-form-item label="Password" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-input-password v-model:value="form.password" placeholder="Enter password" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 16, offset: 6 }">
          <a-button type="primary" html-type="submit" block>Login</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const handleSubmit = () => {
  if ((form.username === 'admin' && form.password === '66') || 
      (form.username === 'normaluser' && form.password === '88')) {
    const user = {
      username: form.username,
      role: form.username === 'admin' ? 'admin' : 'user'
    }
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/home')
  } else {
    alert('Invalid username or password')
  }
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
}

.login-form {
  width: 400px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  h2 {
    text-align: center;
    margin-bottom: 24px;
    color: #1890ff;
  }
}
</style>