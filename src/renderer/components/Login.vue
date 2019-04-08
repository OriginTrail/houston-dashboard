<template>
    <div class="wrapper-fluid" id="dashboard">
        <div class="login-beta-logo">
            <div class="text-center logo beta-logo">
                <img id="logo" src="~@/assets/origintrail_white.png" alt="origin-trail"
                     style="width:140px;position: absolute;
    left: 0;">
                <p class="beta custom-beta">
                    BETA
                </p>
            </div>

        </div>
        <el-row>
            <el-col :span="24">
                <main class="login-main">
                    <div class="left-side">
                        <div>
                            <div class="value" v-if="!systemInfo.identity">
                                <!--<p>Not connected to node</p>-->
                                <h2 class="h1-login">Login to use Houston app</h2>

                                <el-form ref="form" :model="credentials" label-position="top"
                                         size="small" @keyup.enter.native="login">
                                    <el-row>
                                        <el-col :span="24">

                                            <el-form-item label="Node address">
                                                <el-col :span="24">
                                                    <el-input v-model="credentials.inputIp">
                                                        <template slot="append">
                                                            <el-popover
                                                                    placement="right"
                                                                    title="Host address"
                                                                    width="200"
                                                                    popper-class="tool-tip"
                                                                    trigger="hover"
                                                                    content="Host address of the server where node is installed. If this same machine, then type localhost"
                                                            >
                                                                <el-button class="pop2" slot="reference">
                                                                    <img src="~@/assets/info.svg" alt="" class="popover-icon">
                                                                </el-button>
                                                            </el-popover>
                                                        </template>
                                                    </el-input>
                                                </el-col>
                                                <el-col :span="2">

                                                </el-col>
                                            </el-form-item>


                                            <el-form-item label="Port">
                                                <el-col :span="24">
                                                    <el-input v-model="credentials.inputPort">
                                                        <template slot="append">
                                                            <el-popover
                                                                    placement="right"
                                                                    title="Port"
                                                                    width="200"
                                                                    popper-class="tool-tip"
                                                                    trigger="hover"
                                                                    content="Default Houston port is 3000"
                                                            >
                                                                <el-button class="pop2" slot="reference">
                                                                    <img src="~@/assets/info.svg" alt="" class="popover-icon">
                                                                </el-button>
                                                            </el-popover>
                                                        </template>
                                                    </el-input>
                                                </el-col>
                                            </el-form-item>


                                            <el-form-item label="Password">
                                                <el-col :span="24">
                                                    <el-input v-model="credentials.password">
                                                        <template slot="append">
                                                            <el-popover
                                                                    placement="right"
                                                                    title="Password"
                                                                    width="200"
                                                                    popper-class="tool-tip"
                                                                    trigger="hover"
                                                                    content="Password is displayed in the terminal everytime you start the node"
                                                            >
                                                                <el-button class="pop2" slot="reference">
                                                                    <img src="~@/assets/info.svg" alt="" class="popover-icon">
                                                                </el-button>
                                                            </el-popover>
                                                        </template>
                                                    </el-input>
                                                </el-col>
                                            </el-form-item>

                                            <el-form-item label="Secured connection">
                                                <el-col :span="20">
                                                    <el-switch v-model="credentials.secured"></el-switch>
                                                </el-col>
                                                <el-col :span="4">
                                                    <el-popover
                                                            placement="top-start"
                                                            title="Use secured connection"
                                                            width="250"
                                                            trigger="hover"
                                                            content="Enable secure layer. Node has to have a valid certificates."
                                                            class="marginleft">

                                                        <el-button class="pop2" slot="reference"><img src="~@/assets/id-ic-info-circle.svg" alt=""
                                                                                                     class="info-i3"></el-button>
                                                    </el-popover>
                                                </el-col>
                                            </el-form-item>


                                            <el-col class="start">
                                                <el-form-item>
                                                    <el-button class="login-button" @click="login"><h5>Start <img
                                                            src="~@/assets/id-ic-arrow-forward.svg" alt=""></h5><img
                                                            src="" alt="">
                                                    </el-button>
                                                </el-form-item>
                                            </el-col>
                                        </el-col>
                                    </el-row>
                                </el-form>

                            </div>
                            <div v-else>
                                <div class="value">Connected to node</div>
                                {{systemInfo}}
                                <div class="items">
                                    <div class="item">
                                        <div class="name">Version:</div>
                                        <div class="value">{{ systemInfo.versions }}</div>
                                    </div>

                                    <div class="item-two-lines">
                                        <div class="name">Your identity:</div>
                                        <div class="value">{{ systemInfo.identity }}</div>
                                    </div>

                                    <div class="item-two-lines">
                                        <div class="name">Hostname and port:</div>
                                        <div class="value">{{ systemInfo.contact.protocol }}//{{
                                            systemInfo.contact.hostname }}:{{ systemInfo.contact.port }}
                                        </div>
                                    </div>
                                    <el-row>
                                        <el-col class="loading-screen">
                                            <h1 class="dot one">.</h1>
                                            <h1 class="dot two">.</h1>
                                            <h1 class="dot three">.</h1>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </el-col>
        </el-row>
        <div class="login-beta-version">
            <div class="text-center">
                <el-col class="node-version login-node-version">
                    HOUSTON BETA V{{ version }}
                </el-col>
            </div>

        </div>

        <div class="rights-reserved">
            <p class="rights">©2019. <span>OriginTrail</span> All rights reserved. </p>
        </div>
    </div>
</template>

<script>
    import { remote } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
    import path from 'path';
    import fs from 'fs';
    import { version, name } from '../../../package.json';
    import utils from '../utils';

    export default {
      data() {
        return {
          name: this.$route.name,
          node: process.versions.node,
          path: this.$route.path,
          redirect: false,
          platform: require('os').platform(),
          vue: require('vue/package.json').version,
          version,
          credentials: {
            inputIp: '',
            inputPort: 3000,
            password: '',
            secured: false,
            _id: 'credentials',
          },
          systemInfo: {
            contact: {
              protocol: '',
              host: '',
              port: '',
              versions: '',
            },
            identity: '',
          },
        };
      },
      methods: {
        login() {
          if (this.credentials.password.length === 0
            || this.credentials.inputPort.length === 0
            || this.credentials.inputIp.length === 0) {
            return;
          }
          db.insert(this.credentials);
          const nodeUrl = utils.buildNodeSocketUrl(this.credentials);
          this.$socket.io.uri = `${nodeUrl}/?password=${this.credentials.password}`;
          this.$nextTick(() => {
            this.$socket.open();
          });

          try {
            const userDataPath = remote.app.getPath('userData');
            const appDataPath = path.join(userDataPath, `.${name}.json`);
            const data = {
              host: this.credentials.inputIp,
              port: this.credentials.inputPort,
              secured: this.credentials.secured,
            };
            fs.writeFileSync(appDataPath, JSON.stringify(data));
          } catch (e) {
            console.error(e);
          }
        },
      },
      mounted() {
        EventBus.$on('system_received', () => {
          db.findOne({ _id: 'credentials' }, (err, doc) => {

          });
        });

        try {
          const userDataPath = remote.app.getPath('userData');
          const appDataPath = path.join(userDataPath, `.${name}.json`);
          if (fs.existsSync(appDataPath)) {
            const appData = JSON.parse(fs.readFileSync(appDataPath));
            if (appData.host) {
              this.credentials.inputIp = appData.host;
            }
            if (appData.port) {
              this.credentials.inputPort = appData.port;
            }
            if (appData.secured) {
              this.credentials.secured = appData.secured;
            }
          }
        } catch (e) {
          console.error(e);
        }
      },
      watch: {
        redirect() {
          // this.$router.push({ path: '/account' });
          // setTimeout(() => this.$router.push({ path: '/account' }), 2000);
        },
      },
      computed: {},
    };
</script>

<style scoped>

    .left-side {
        border-radius: 6px;
        background-color: #ffffff;
        box-shadow: 0 4px 8px 0 rgba(82, 97, 115, 0.18);
        padding: 10px 60px;
    }

    .start {
        margin-top: 12px;
    }

    .pop-over-custom {
        text-align: left;
    }

    .login-node-version {
        margin-left: 0;
    }

    .account {
        background-color: #ffffff;
    }

    .wrapper-fluid {
        background-image: url("~@/assets/09-testnet.svg") !important;
    }

    .rights {
        text-align: center;
        color: darkgrey;
        margin-bottom: -20px;
    }

    .rights-reserved {
        position: absolute;
        bottom: 25px;
        left: 25px;
        line-height: 1.5;
        z-index: 1001;
        width: 100%;
        margin-left: -23px;
    }

    .rights span {
        color: white
    }

    .title {
        color: #888;
        font-size: 18px;
        font-weight: initial;
        letter-spacing: .25px;
        margin-top: 10px;
    }

    .login-button {
        color: #080a30;
        background-color: #080a30;
        border-radius: 2px;
        border: none;
        width: 180px;
        height: 52px;
    }

    .login-button h5 {
        width: 76px;
        height: 16px;
        font-size: 20px;
        font-weight: 300;
        font-style: normal;
        font-stretch: normal;
        line-height: 0.8;
        letter-spacing: normal;
        color: #ffffff;
        text-align: center;
        padding-left: 50px;
    }

    .login-button img {
        position: absolute;
        top: 14px;
        left: 142px;
    }

    .login-button:hover {
        background-color: #3f6d82;

    }

    .custom-beta {
        line-height: inherit;
    }

    .items {
        margin-top: 8px;
    }

    .item {
        display: flex;
        margin-bottom: 8px;
    }

    .item-two-lines {
        margin-bottom: 8px;
    }

    .item .name, .item-two-lines .name {
        color: #6a6a6a;
        margin-right: 6px;
    }

    .item .value, .item-two-lines .value {
        color: #35495e;
        font-weight: bold;
    }

    .input-label {
        display: inline-block;
        width: 130px;
    }

    .loading-screen {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-top: 40px;
    }

    .h4 {
        opacity: 0.5;
        font-size: 20px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: #526173;
        text-align: center;
    }

    .h1-login {
        font-size: 28px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #1a4559;
        text-align: center;
        margin-bottom: 28px;
    }

    .loading-dots {
        text-align: center;
        z-index: 5;
    }

    .dot {
        display: inline;
        margin-left: 0.2em;
        margin-right: 0.2em;
        position: relative;
        top: -1em;
        font-size: 3.5em;
        opacity: 0;
        animation: showHideDot 2.5s ease-in-out infinite;
    }

    .one {
        animation-delay: 0.2s;
    }

    .two {
        animation-delay: 0.4s;
    }

    .three {
        animation-delay: 0.6s;
    }

    .info-i {
        position: absolute;
        top: 5px;
        width: 18px;
        margin-left: 6px;
        left: 550px;
    }

    .ppp {
        width: 121px;
        background-color: #50516a;
        color: #ffffff;
        border-radius: 10px;
        /*top: 225px !important;*/
        border: none;

    }

    .el-popover__title {
        color: white !important;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.67;
    }

    .el-button {
        border: none;
    }

    .popover-icon {
        margin-top: 4px;
        width: 20px;
        margin-left: -4px;
    }

    .login-beta-logo {
        position: absolute;
        top: 25px;
        left: 25px;
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
        width: 230px;
        text-decoration: none;
        cursor: pointer;
        z-index: 1001;
    }

    .info-i3{
        position: absolute;
        top: 10px;
        opacity: 0.5;
        width: 20px;
        margin-left: 6px;
        left: 280px;
    }

    .login-beta-version {
        position: absolute;
        bottom: 25px;
        left: 25px;
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
        width: 230px;
        z-index: 1001;
    }

    .beta-logo {
        width: 217px;
        margin-top: 0;
    }

    .el-input-group__append:focus, .el-input-group__prepend:focus {
        border-color: #409EFF;
        outline: 0;
    }

    .el-input__inner {
        border-right: 1px solid white;
    }

    .el-input-group__append, .el-input-group__prepend {
        background-color: white;
    }

    @keyframes showHideDot {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        60% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>

