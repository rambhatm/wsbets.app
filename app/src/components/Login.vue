
<template>
    <div>    
        <h2>Login</h2>    
        <button v-on:click="login">Login with Reddit!</button> 
    </div>
</template>

<script>
    import router from "../router"    
    import axios from "axios"    
    export default {    
        name: "Login",    
        methods: {    
            login: async() => {
                try {
                    await axios.get("/api/auth/reddit")
                } catch (error) {
                    error.stack
                }
            }    
        }    
    }
</script>