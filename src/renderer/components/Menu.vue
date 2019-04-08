<template>
    <div class="menu">
        <div class="text-center logo">
            <router-link to="/"><img id="logo" src="~@/assets/origintrail_white.png" alt="origin-trail"
                                     style="  width:140px"></router-link>
        </div>
    <el-menu
            :default-active="this.$route.name"
            class="el-menu-vertical-demo"
            router
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            @open="handleOpen"
            @close="handleClose">
        <el-menu-item index="dashboard" :route="{name: 'dashboard'}">
            <i class="el-icon-menu"></i>
            <span>Dashboard</span>
        </el-menu-item>
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-location"></i>
                <span>Node Management</span>
            </template>
            <el-menu-item-group title="Database">
                <el-menu-item index="imports" :route="{name: 'imports'}">Imports</el-menu-item>
                <el-menu-item index="visualisation" :route="{name: 'visualisation'}">Data visualisation</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Jobs running">
                <el-menu-item index="holding">Holding data</el-menu-item>
                <el-menu-item index="offered">Replicated data</el-menu-item>
            </el-menu-item-group>
            <!--<el-submenu index="1-4">-->
                <!--<template slot="title">item four</template>-->
                <!--<el-menu-item index="1-4-1">item one</el-menu-item>-->
            <!--</el-submenu>-->
        </el-submenu>

        <el-menu-item index="import" :route="{name: 'import'}">
            <i class="el-icon-document"></i>
            <span>Import XML</span>
        </el-menu-item>
        <el-menu-item index="configuration" :route="{name: 'configuration'}">
            <i class="el-icon-setting"></i>
            <span>Configuration</span>
        </el-menu-item>
    </el-menu>
    </div>
</template>

<script>
    export default {
      mounted() {

      },
      methods: {
        handleOpen(key, keyPath) {
        },
        handleClose(key, keyPath) {
        },
      },
    };
</script>

<style>

    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body { font-family: 'Source Sans Pro', sans-serif; }


    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 420px;
    }

    .menu {
        z-index: 1000;
        width: 200px;
        border-right: solid 1px #e6e6e6;
        height: 100vh;
        background-color:  #090932;
    }
    .el-menu {
        border-right: none;
    }


</style>
