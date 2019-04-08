<template>
    <div id="app">
        <div class="main">
            <div v-if="logedIn === true">
                <a class="support-section" @click="redirectBeta">
                    <img src="~@/assets/id-ic-black-support.svg" alt=""> BETA Program Support
                </a>
                <a class="logout-section" @click="logout">
                    <img src="~@/assets/id-ic-black-logout.svg" alt=""> Logout
                </a>
            </div>

            <div v-else>
                <a class="quit" @click="quit">
                    <img src="~@/assets/id-ic-white-quit.svg" alt=""> Quit Houston
                </a>
            </div>

            <div class="menu">
                <el-row>
                    <el-col :span="16">
                        <div class="text-center logo">
                            <router-link to="/" class="beta">
                                <img id="logo" src="~@/assets/origintrail_white.png" alt="origin-trail"
                                     style="  width:140px">
                            </router-link>
                        </div>
                    </el-col>
                    <el-col class="beta" :span="6">
                        BETA
                    </el-col>
                </el-row>


                <el-menu
                        :default-active="this.$route.name"
                        class="el-menu-vertical-demo menu-custom"
                        router
                        background-color="#090932"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                >
                    <div class="hot-spot">
                        <h4 class="ankle-breaker">
                            HOUSTON
                        </h4>
                    </div>
                    <el-menu-item index="account" :route="{name: 'account'}">
                        <!--<i class="el-icon-menu"></i>-->
                        <span>My Account</span>
                    </el-menu-item>
                    <div class="hot-spot">
                        <h4 class="ankle-breaker">
                            NODE
                        </h4>
                    </div>
                    <el-menu-item index="import-parent" :route="{name: 'import-parent'}">
                        <!--<i class="el-icon-menu"></i>-->
                        <span>Imports</span>
                    </el-menu-item>
                    <el-menu-item index="jobs" :route="{name: 'jobs'}">
                        <!--<i class="el-icon-menu"></i>-->
                        <span>Jobs</span>
                    </el-menu-item>
                    <el-menu-item index="odn_search" :route="{name: 'odn_search'}">
                        <!--<i class="el-icon-menu"></i>-->
                        <span>ODN Search</span>
                    </el-menu-item>
                    <el-menu-item index="configuration" :route="{name: 'configuration'}">
                        <!--<i class="el-icon-setting"></i>-->
                        <span>Configuration</span>
                    </el-menu-item>
                </el-menu>
                <div class="node-status">
                    <div class="hot-spot">
                        <h4 class="ankle-breaker">
                            NODE STATUS
                        </h4>
                    </div>
                    <el-row>
                        <div v-if="this.node_active = true">
                            <el-col class="status">
                                <div class="status-indicator"></div>
                                Running
                            </el-col>
                        </div>
                        <div v-else>
                            <el-col class="status">
                                <div class="inactive-status-indicator"></div>
                                Running
                            </el-col>
                        </div>

                    </el-row>

                    <el-row>
                        <a @click="restartNode">
                            <el-col class="restart-node">
                                <img class="restart-logo" src="~@/assets/id-ic-white-restart.svg" alt="">
                                <span class="restart-span">Restart node</span>
                            </el-col>
                        </a>
                    </el-row>
                    <el-row>
                        <el-col class="node-version">
                            HOUSTON BETA V{{ version }}
                        </el-col>
                    </el-row>
                </div>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
    import Semver from 'semver';
    import Connection from './Connection';
    import { version } from '../../package.json';
    import utils from './utils';


    export default {
      components: {},
      data() {
        return {
          appWindow: remote.getCurrentWindow(),
          version: '',
          tableData: [],
          node_active: false,
          logedIn: false,
          contact: {
            protocol: '',
            host: '',
            port: '',
            versions: '',
          },
          identity: '',
        };
      },
      mounted() {
        this.$socket.emit('get-imports');
        this.logoutAndClear();
        Connection.checkCredentials().then((credentials) => {
          if (credentials) {
            this.$socket.io.uri = `${credentials.inputIp}:${credentials.inputPort}?password=${credentials.password}`;
            this.$nextTick(() => {
              this.$socket.open();
              LoggedIn = true;
            });
          }
        });
        db.findOne({ _id: 'system' }, (err, doc) => {
          try {
            this.identity = doc.system.info.identity;
          } catch (e) {
            // error
          }
        });
        this.version = version;
      },
      sockets: {
        connect() {
          this.$socket.emit('get-node-info');
        },
        error(error) {
          if (error === 'Not authorized') {
            this.$notify({
              title: 'Invalid credentials',
              message: 'Please check your ip and password.',
              type: 'error',
              iconClass: 'el-icon-error',
              duration: 0,
            });
          }
          this.logoutAndClear();
        },
        nodeInfo(info) {
          if (info && info.version && Semver.valid(info.version) && Semver.gte(info.version, '2.0.52')) {
            this.node_active = true;
            this.logedIn = true;
            LoggedIn = true;
            Connection.checkCredentials().then((credentials) => {
              if (credentials) {
                this.appWindow.setTitle(`OriginTrail Node Dashboard (${utils.buildNodeSocketUrl(credentials)})`);
              }
            });
            this.$router.push({ path: '/account' });
          } else {
            this.$notify({
              title: 'Unsupported version',
              message: `Unsupported version. Got: ${info && info.version ? info.version : 'unknown'}. Target node cannot be used with this Houston version.`,
              type: 'error',
              iconClass: 'el-icon-error',
              duration: 0,
            });
            this.$socket.close();
            this.logoutAndClear();
          }
        },
        reconnect() {
          this.node_active = true;
          this.$router.push({ path: '/account' });
        },
        connect_error() {
          this.$notify({
            title: 'Bad credentials or node not available',
            message: 'Can\'t connect to node. Please check your ip, password. Also check if port is maybe taken by another process.',
            type: 'error',
            iconClass: 'el-icon-error',
            duration: 5000,
          });
          this.$socket.close();
          this.logoutAndClear();
        },

        connect_timeout() {
          //
        },
        disconnect() {
          console.log('disconnected');
        },
        system(val) {
          const system = {
            system: val,
            _id: 'system',
          };
          db.insert(system, () => {
            EventBus.$emit('system_received', val);
            LoggedIn = true;
          });
        },

        config(val) {
          const config = { config: val,
            _id: 'config',
          };

          db.insert(config, (err, newDoc) => {
            console.log(newDoc);
          });
        },
        remotelog(val) {
          console.log(val);
        },
        addingBid(val) {
          console.log(val);
          this.$notify({
            title: 'Adding bids...',
            message: val,
            type: 'success',
            iconClass: 'el-icon-loading',
            dangerouslyUseHTMLString: true,
            duration: 8000,
          });
        },
        bidNotTaken(val) {
          this.$notify({
            title: 'My bid was not selected',
            message: val,
            type: 'warning',
            duration: 8000,
            iconClass: 'el-icon-warning',
          });
        },
        replicationRequestSent(val) {
          this.$notify({
            title: val,
            message: '',
            type: 'success',
            iconClass: '',
          });
        },
        replicationReqestFailed(val) {
          this.$notify.error({
            title: val,
            message: '',
            type: 'error',
            iconClass: 'el-icon-error',
          });
        },
        sendingRootHashes(val) {
          this.$notify.info({
            title: val,
            message: '',
            iconClass: 'el-icon-tickets',
          });
        },
        dhReplicationFinished(val) {
          this.$notify({
            title: val,
            message: '',
            type: 'success',
            iconClass: 'el-icon-success',
          });
        },
        failedOfferHandle(val) {
          const error = JSON.parse(val.substr(val.indexOf('{')));
          const message = `<strong>From:</strong> ${error.from}<br><strong>To:</strong> ${error.from}<br><strong>Gas used:</strong> ${error.gasUsed}<br><strong>Transaction hash:</strong> ${error.transactionHash}`;
          this.$notify({
            title: 'Failed to handle offer. Transaction ran out of gas.',
            message,
            dangerouslyUseHTMLString: true,
            type: 'error',
            iconClass: 'el-icon-error',
            duration: 50000,
          });
        },
        networkQueryOfferArrived(val) {
          console.log(val);
        },
        noOffersForQuery(val) {
          this.$notify.error({
            title: val,
            message: '',
            type: 'error',
            iconClass: 'el-icon-error',
          });

          EventBus.$emit('no-offers-for-query');
        },
        answerNotFound(val) {
          this.$notify.error({
            title: val,
            message: '',
            type: 'error',
            iconClass: 'el-icon-error',
          });
          EventBus.$emit('answer-not-found');
        },
        offerInitiated(val) {
          this.$notify({
            title: val,
            message: '',
            type: 'info',
            iconClass: 'el-icon-loading',
          });
        },
        readNotifications(val) {
          this.$notify({
            title: val,
            message: `Dataset ${val.dataSetId} purchased.`,
            type: 'info',
            iconClass: 'el-icon-loading',
          });
        },
      },
      methods: {
        logout(done) {
          this.$confirm('Keep in mind that this will not stop your node altogether', 'Are you sure you want to logout?', {
            customClass: 'custom-close',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonClass: 'custom-logout-yes',
            cancelButtonClass: 'custom-logout-no',
            center: true,
            dangerouslyUseHTMLString: true,
            message: '<p class="confirm-h3">Keep in mind that this will not stop your node</p><br><p id="confirm-p"></p><h5 id="confirm-h5"></h5>',
          })
            .then((_) => {
              this.logoutAndClear();
            })
            .catch((_) => {
            });
        },
        logoutAndClear() {
          LoggedIn = false;
          this.logedIn = false;
          this.$socket.disconnect();
          db.remove({ _id: 'system' }, { multi: true }, (err, numRemoved) => {});
          db.remove({ _id: 'config' }, { multi: true }, (err, numRemoved) => {});
          db.remove({ _id: 'credentials' }, { multi: true }, (err, numRemoved) => {
            db.loadDatabase((err) => {
              this.$router.push({ name: 'dashboard' });
            });
          });
          this.appWindow.setTitle('OriginTrail Node Dashboard');
        },
        redirectBeta() {
          this.$router.push('/beta-support');
          this.redirect = true;
        },
        quit() {
          this.appWindow.close();
        },
        restartNode() {
          this.$socket.emit('restart-node');
          this.logoutAndClear();
        },
      },
    };
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
    @import url('https://fonts.googleapis.com/css?family=Roboto');
    @import url('../../bower_components/alchemyjs/dist/alchemy.css');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Roboto', sans-serif;
    }
    a{ cursor: pointer;}
    #app {

    }
    .el-notification {
        width: 600px;
    }

    .el-notification__content{
        text-align: left;
    }

    .tool-tip {
        text-align: left;
    }

    h1 {
        font-size: 46px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.3;
        letter-spacing: normal;
        color: #526173;
        margin-bottom: 40px;
    }

    h3 {
        font-size: 16px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: 4.8px;
        color: #526173;
        margin-bottom: 20px;
    }

    #dashboard {
        background-color: #090932 !important;
        position: fixed;
        z-index: 2000;
    }


    .node-logo > div > svg {
        position: static !important;
        left:inherit;
        height: 30px;
        width: 30px;
    }

    #hexContainerID > div > div > svg {
        position: static !important;
        left:inherit;
        height: 30px;
        width: 30px;
    }

    svg {
        position: static !important;
    }

    .el-pagination {
        margin: 30px 0 40px 0;
    }

    .wrapper {
        width: 100%;
        margin: 0;
        margin-left: 220px;
        position: relative;
        height: 100%;
        padding: 60px 80px 60px 80px;
    }

    .status {
        margin-left: 20px;
        margin-top: 10px;
        margin-bottom: 10px;
        color: #14da9e;
    }

    #confirm-p {
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: #526173;
        text-align: left;
    }

    #confirm-h5 {
        font-size: 16px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: #2d095e;
        text-align: center;
    }

    #confirm-wrapper {
        background-color: #e6e6e7;
    }

    .lead-paragraph {
        margin-bottom: 30px;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: #526173;
    }

    .restart-logo {
        margin-right: 3px;
        width: 15px;
    }

    .v-modal {
        z-index: 1999 !important;
    }

    .restart-node {
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
        color: #ffffff;
        margin-left: 18px;
        padding: 5px 0;
        line-height: 2;
        display: flex;
        align-items: center;
    }

    .restart-span {
        opacity: 0.7;
    }

    .node-version {
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.67;
        letter-spacing: normal;
        color: #ffffff;
        opacity: 0.7;
        margin-left: 18px;
    }

    .status-indicator {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #14da9e;
    }
    .inactive-status-indicator {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #ffffff;
    }

    .el-table .cell {
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }

    .logout-section {
        position: absolute;
        top: 25px;
        right: 25px;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
        color: #526173;
        display: flex;
        justify-content: space-between;
        align-content: center;
        line-height: 1.5;
        width: 70px;
        text-decoration: none;
        cursor: pointer;
        z-index: 1001;
    }

    .quit {
        position: absolute;
        top: 25px;
        right: 25px;
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 2.14;
        letter-spacing: normal;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-content: center;
        width: 113px;
        text-decoration: none;
        cursor: pointer;
        z-index: 1001;
    }

    .support-section {
        position: absolute;
        top: 25px;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
        color: #526173;
        display: flex;
        justify-content: space-between;
        align-content: center;
        line-height: 1.5;
        width: 192px;
        right: 113px;
        text-decoration: none;
        z-index: 1001;
    }

    .node-status {
        position: fixed;
        bottom: 20px;
        margin-top: auto;
        color: #14da9e;
    }

    .el-dialog {
        width: 432px !important;
    }

    .ankle-breaker {
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 2;
        letter-spacing: 3.6px;
        color: #ffffff;
        margin-left: 20px;
        opacity: 0.5;
    }

    .beta {
        color: #14da9e;
        text-decoration: none;
        line-height: 6.2;
        margin-left: 8px;
    }

    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 140px;
        position: absolute;
        top: 0;
        left: 5%;
    }

    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 420px;
    }

    .menu-custom {
        height: 100vh;
    }

    .menu {
        width: 200px;
        min-width: 200px;
        border-right: solid 1px #e6e6e6;
        min-height: 100%;
        background-color: #090932;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        height: 100%;
        z-index: 1000;

    }

    .propba {
        width: 280px;
        border-right: solid 1px #e6e6e6;
        height: 100vh;
        background-color: #090932;
    }

    .el-menu {
        border-right: none;
    }

    .el-submenu {
        opacity: 0.75;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #ffffff;
    }

    .el-menu-item {
        opacity: 0.7;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #ffffff;
        padding-top: 20px;
    }

    .main {

        /*overflow: hidden;*/
    }

    main {
        display: flex;
        justify-content: space-between;
    }

    main.login-main {
        justify-content: center !important;
    }

    /*main > div {*/
        /*flex-basis: 50%;*/
    /*}*/

    .left-side {
        display: flex;
        flex-direction: column;
        width: 440px;
        height: auto;
    }

    .welcome {
        color: #555;
        font-size: 23px;
        margin-bottom: 10px;
    }

    .title {
        color: #2c3e50;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 6px;
    }

    .title.alt {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .doc p {
        color: black;
        margin-bottom: 10px;
    }

    .doc button {
        font-size: .8em;
        cursor: pointer;
        outline: none;
        padding: 0.75em 2em;
        border-radius: 2em;
        display: inline-block;
        color: #fff;
        background-color: #4fc08d;
        transition: all 0.15s ease;
        box-sizing: border-box;
        border: 1px solid #4fc08d;
    }

    .doc button.alt {
        color: #42b983;
        background-color: transparent;
    }

    .text-center {
        text-align: center;
    }

    .logo {
        margin-top: 30px;
        margin-bottom: 30px;
        color: #42b983;
        height: 50px;
        position: relative;
        padding-right: 40px;
        line-height: 2.4;
        display: flex;
        justify-content: flex-end;
    }

    .wrapper-fluid {
        height: 100vh;
        width: 100%;
        padding: 60px 80px;
        position: absolute;
    }

    .margin-bottom-40 {
        margin-bottom: 40px;
    }

    .main {
        display: flex;
        height: 100vh;
    }

    .el-menu-item.is-active {
        color: white !important;
        border-left: 4px solid #42b983;
        opacity: 1;
    }

    .el-button--primary {
        background-color: #090932 !important;
        color: white !important;
    }

    .el-form-item__label {
        width: 100%;
        text-align: left;
    }

    .el-loading-mask {
        padding-left: 40%;
        height: 134px;
        background-color: white;
        margin-top: 10px;
    }

    .margin-10 {
        margin-bottom: 10px;
    }

    .margin-20 {
        margin-bottom: 20px;
    }

    .margin-30 {
        margin-bottom: 30px;
    }

    .margin-40 {
        margin-bottom: 40px;
    }

    .margin-50 {
        margin-bottom: 50px;
    }

    .menu-wrapper {

    }

    .custom-close{
        padding-top: 40px;
        width: 541px;
        height: 467px;
        border-radius: 6px;
    }

    .el-message-box__title{
        font-size: 28px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.29;
        letter-spacing: normal;
        text-align: center;
        color: #526173;
    }

    .el-menu-item {
        box-sizing: border-box;
        width: 100%;
    }

    .el-menu-item.is-active {
        animation-name: active-border;
        animation-duration: 0.3s;
    }

    @keyframes active-border {
        from {border-left: 0 solid #42b983;}
        to {border-left: 4px solid #42b983;}
    }

    .el-message-box__message p {
        font-size: 20px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: center;
        color: #526173;
        opacity: .5;
    }

    .el-message-box--center .el-message-box__content {
        padding-left: 43px;
        padding-right: 43px;
    }

    .el-message-box__headerbtn .el-message-box__close{
        position: absolute;
        font-size: 24px;
        top: -100px;
        right: 0;
    }

    .el-message-box__btns {
        position: relative;
        margin-top: 20px;
    }

    .custom-logout-yes{
        width: 180px;
        height: 52px;
        position: absolute;
        left: 65px;
        font-size: 20px;
    }

    .custom-logout-no{
        width: 180px;
        height: 52px;
        position: absolute;
        right: 65px;
        font-size: 20px;
    }
    .el-message-box__header{
        padding: 0;
    }
    .el-message-box--center .el-message-box__header{
        margin-top: 0 !important;
        margin-bottom: 20px;
    }

    .el-button:focus, .el-button:hover {
        background-color: #fff;
    }

    .el-form-item__label {
        opacity: 0.5;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #526173;
        padding-bottom: 12px;
    }

    .el-input--small .el-input__inner {
        height: 38px;
        line-height: 38px;
    }


</style>

