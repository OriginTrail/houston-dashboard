<template>
    <div class="wrapper">
        <div class="el-row">
            <div class="el-col">
                <h1 class="imports-headline">Imports</h1>
            </div>
        </div>
        <div class="el-row">
            <div class="el-col">
                <p class="lead-paragraph">
                    To store your files on the ODN Network, you must import structured XML files. To submit your imported dataset to the ODN, you should create an offer. Here is a list view of all your imported datasets with their offers.
                </p>
            </div>
        </div>

        <div class="el-row">
            <div class="el-col">
                <import></import>
            </div>
        </div>
        <div class="el-row">
            <div class="el-col">
                <imports></imports>
            </div>
        </div>
    </div>
</template>

<script>
    import Menu from './Menu';
    import Import from './Import';
    import Imports from './Imports';
    export default {
      name: 'importParent',
      components: { Menu, Import, Imports },
      created() {

      },
      data() {
        return {
          config: '',
          ident: '',
          form: {
            node_wallet: '',
            node_private_key: '',
            node_rpc_ip: '',
            node_port: '',
          },
        };
      },
      watch: {
        // call again the method if the route changes
        $route: 'fetchData',
      },
      methods: {

      },
    };
</script>

<style>
    .imports-headline{
        color: #1a4559;
    }

</style>

