<template></template>

<script>
import axios from "axios"    
import router from "../router"    
    export default {    
        name: "Login",    
        data() {    
            return {    
                user : {}
            }    
        },    
        methods: {    
            getUserData: async function() {    
                try {
                    let self = this
                    let response = await axios.get("/api/auth/user")
                    self.$set(this, "user", response.data.user)
                } catch(err) {
                    console.log(err)
                    router.push("/")
                }
            }    
        },    
        mounted() {    
            this.getUserData()    
        }    
    }
</script>

<style>
</style>