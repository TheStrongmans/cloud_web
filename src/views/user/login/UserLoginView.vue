<template>
    <div class="login">
        <h1 style="text-align: center; font-size: 2rem;">登录</h1>
        <el-card>
            <p>用户名：</p>
            <el-input v-model="username"  placeholder="用户名" size="large"/>
            <p>密码：</p>
                <el-input
                    v-model="password"
                    type="password"
                    placeholder="密码"
                    size="large"
                    show-password
                />
            <p class="error-message">{{error_message}}</p>
            <el-button type="primary" style="width: 100%;" size="large" @click="login">
                <span style="font-size: 1.2rem;">登&nbsp;&nbsp;录</span>
            </el-button>
        </el-card>
    </div>

</template>

<script>
import { ref } from 'vue'
import router from '@/router/index';
import { useStore } from 'vuex';
export default {
    name: "LoginUserView",
    setup() {
        let store = useStore();
        let username = ref("");
        let password = ref("");
        let error_message = ref("");

        const login = () => {
            error_message.value = "";
            store.dispatch("login", {
                username: username.value,
                password: password.value,
                success() {
                    router.push({
                        name: "home",
                    })
                },
                error() {
                    error_message.value = "用户名或密码错误";
                }    
            })
            console.log(name.value, password.value);
            
        }
        return {
            username,
            password,
            error_message,
            login,
        }
    }
}
</script>

<style scoped>

.login {
    width: 100%;
    padding: 0 30%;
    box-sizing: border-box;
}

.error-message {
    margin: 1rem 0;
    color: red;
}
</style>