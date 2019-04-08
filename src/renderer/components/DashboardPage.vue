<template>
    <div>
        <login></login>
    </div>
</template>

<script>
  import Login from './Login';
  import Account from './Account';

  export default {
    name: 'dashboard',
    components: { Login, Account },
    data() {
      return {
        node: process.versions.node,
        path: this.$route.path,
        platform: require('os').platform(),
        vue: require('vue/package.json').version,
      };
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      otnode() {
        const otnode = this.$store.state.OtNode.otnode.info;
        if (otnode === undefined) {
          return {
            contact: {
              protocol: '',
              host: '',
              port: '',
              versions: '',
            },
            identity: '',
          };
        }
        return otnode;
      },
    },
  };
</script>

<style scoped>
    /*#dashboard {*/
        /*background: #090932 !important;*/
    /*}*/

    .left-side {
        border-radius: 6px;
        background-color: #ffffff;
        box-shadow: 0 4px 8px 0 rgba(82, 97, 115, 0.18);
        padding: 45px 60px;
    }

    .account {
        background-color: #ffffff;
    }
    .wrapper-fluid{
        background-image: url("~@/assets/09-testnet.svg") !important;
    }

    .rights{
        text-align: center;
        color: darkgrey;
        margin-top: 250px
    }
    .rights span{
        color: white
    }

    .login-wrapp {
        background-color: white;
        width: 100%;
        height: 100%;
    }



</style>

