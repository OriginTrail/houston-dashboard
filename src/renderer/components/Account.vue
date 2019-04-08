<template>
    <div class="wrapper">
        <div class="el-row">
            <div class="el-col">
                <h1 class="margin-20 account-headline">My Account</h1>
            </div>
        </div>
        <div class="el-row">
            <div class="el-col">
                <p class="margin-30 lead-paragraph">
                    This is the landing page for your own node of the OriginTrail Decentralized Network (ODN). Here you’ll find general information about your node’s activity and your current balance in test TRAC and ETH.
                    <br>
                    Note: Keep in mind that the Houston app is a visual representation of your node’s activity. You can interact with your node without Houston, as well.
                </p>
            </div>
        </div>
        <div class="el-row">
            <div class="el-col">
                <h3 class="margin-10">GENERAL</h3>
            </div>
        </div>
        <div class="el-row special-row margin-30">
            <el-col :span="5" class="first-radius">
                <div class="el-col field">
                <span class="little-span">Node ID</span>
                </div>
            </el-col>
            <el-col :span="19" class="second-radius">
                <div class="el-col field">
                    <p> {{ system.identity }}</p>
                </div>
            </el-col>
        </div>
        <div class="el-row special-row margin-30">
            <el-col :span="5" class="first-radius">
            <div class="el-col field">
                <p><span class="little-span">Management wallet ID</span></p>
            </div>
            </el-col>
            <el-col :span="19" class="second-radius">
                <div class="el-col field">
                    <p>{{ config.management_wallet }}</p>
                </div>
            </el-col>
        </div>
        <div class="el-row special-row margin-30">
            <el-col :span="5" class="first-radius">
                <div class="el-col field">
                    <p><span class="little-span">Operational wallet ID</span></p>
                </div>
            </el-col>

            <el-col :span="19" class="second-radius">
                <div class="el-col field">
                    <p>{{ config.node_wallet }}</p>
                </div>
            </el-col>
        </div>
        <div class="el-row special-row margin-30">
            <el-col :span="5" class="first-radius">
                <div class="el-col field">
                    <p><span class="little-span">ERC 725 identity</span></p>
                </div>
            </el-col>

            <el-col :span="19" class="second-radius">
                <div class="el-col field">
                    <p>{{ config.erc725Identity }}</p>
                </div>
            </el-col>
        </div>
        <div class="el-row margin-30">
            <div class="el-col line-breaker"></div>
        </div>
        <el-row>
            <el-col :span="24" class="right-balance">
                <div class="el-row">
                    <div class="el-col">
                        <h3 class="margin-10 margintop-10">ASSETS BALANCE</h3>
                    </div>
                </div>
                <el-row class="balance-wrapper">

                    <div ref="nesto" class="node-logo"></div>
                    <el-col class="balancebox margin-10 margintop-10" :span="10">
                        <img class="balance-logo" src="~@/assets/balance-atrac.svg" alt="">
                        <el-col>
                        <p class="balance-cur">TRAC</p>
                        </el-col>
                        <el-col>
                            <p class="balance-info">Total payouts</p>
                            <p v-if="total_payouts !== ''" class="balance-info-currency">{{ total_payouts }}</p>
                            <p v-else class="balance-info-currency">
                                <i class="el-icon-loading"></i>
                            </p>
                        </el-col>
                        <el-col>
                            <p class="balance-info2">Staked (reserved)</p>
                            <p v-if="total_payouts !== ''" class="balance-info-currency">{{ stake }} ({{stake_reserved}})</p>
                            <p v-else class="balance-info-currency">
                                <i class="el-icon-loading"></i>
                            </p>
                        </el-col>
                    </el-col>
                    <el-col class="balancebox margin-10 margintop-10" :span="10">
                        <img class="balance-logo" src="~@/assets/balance-eth.svg" alt="">
                        <el-col>
                            <p class="balance-cur">ETH</p>
                        </el-col>
                        <el-col>
                            <p class="balance-info">Current Balance</p>
                            <p class="balance-info-currency">{{ eth_balance | formatCurrency }}</p>
                        </el-col>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!--<el-row>-->
            <!--<el-col>-->
                <!--<h3 class="margintop-40">IMPORT DATA</h3>-->
            <!--</el-col>-->
        <!--</el-row>-->
        <!--<el-row>-->
            <!--<el-col>-->
                <!--<p>-->
                    <!--Dataset being hold-->
                    <!--<a href="">-->
                        <!--Import Data-->
                    <!--</a>-->
                <!--</p>-->
            <!--</el-col>-->
        <!--</el-row>-->


    </div>
</template>

<script>
    import Menu from './Menu';
    export default {
      components: { Menu },
      data() {
        return {
          name: 'Account',
          node: process.versions.node,
          vue: require('vue/package.json').version,
          eth_balance: '',
          trac_balance: '',
          stake: '',
          stake_reserved: '',
          total_payouts: '',
          system: {
            contact: {
              protocol: '',
              host: '',
              port: '',
              wallet: '',
            },
            identity: '',
            versions: '',
          },
          config: {
            node_wallet: '',
            management_wallet: '',
            erc725Identity: '',
            blockchain: {
              rpc_server_url: '',
            },
          },
          web3: {},
        };
      },
      mounted() {
        EventBus.$on('system_received', () => {
          db.findOne({ _id: 'system' }, (err, doc) => {
            try {
              this.system = doc.system.info;
            } catch (e) {
              //
            }
          });
        });
        if (!this.system.identity) {
          this.$nextTick(() => {
            db.findOne({ _id: 'system' }, (err, doc) => {
              try {
                this.system = doc.system.info;
              } catch (e) {
                //
              }
            });
          });
        }
        this.$socket.emit('get-balance');
        this.$socket.emit('get-total-payouts');
        this.$socket.emit('get-profile');
        // this.$refs.logo.appendChild(jazzicon(30, Web3Utils.hexToNumber('0x0cb3fb6ec130a')));
        db.findOne({ _id: 'credentials' }, (err, doc) => {
          EventBus.$emit('inputIp', doc.inputIp);
        });

        db.find({ _id: 'config' }, (err, docs) => {
          if (docs.length !== 0) {
            this.config = docs[0].config;
          }
        });
      },
      sockets: {
        balance(balance) {
          this.eth_balance = (balance / 1000000000000000000).toFixed(4);
        },
        trac_balance(value) {
          this.trac_balance = (value / 1).toFixed(4);
        },
        profile(profile) {
          this.stake = profile.stake / 1000000000000000000;
          this.stake_reserved = (profile.stakeReserved / 1000000000000000000).toFixed(4);
        },
        total_payouts(val) {
          this.total_payouts = (val / 1000000000000000000).toFixed(4);
        },
      },
      methods: {
      },
      filters: {
        formatCurrency(value) {
          if (typeof value !== 'number') {
            return value;
          }

          return value;
        },
      },
      computed: {

      },
    };
</script>

<style scoped>
    .line-breaker {
        width: 80%;
        height: 1px;
        background-color: #d9dbdf;
    }

    .balance-number {
        font-size: 32px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.31;
        letter-spacing: normal;
        color: #2d095e;
    }

    .float-right {
        float: right;
    }

    .token-logo {
        width: auto;
        height: 100%;
        margin: 0 auto;
    }



    .balance-cur {
        font-size: 24px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #1a4559;
        text-align: center;
        margin-top: 25px;
        margin-bottom: 14px;
    }

    .balancebox {
        position: relative;
        height: 240px;
        width: 240px;
        background: url("~@/assets/outline-logo.png");
        margin-right: 50px;
    }

    .balance-logo {
        position: absolute;
        top: 0;
        left: 0;
    }

    .balance-info-currency {
        font-size: 20px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: #2d095e;
        text-align: center;
        margin-bottom: 7px;
    }

    .balance-info {
        opacity: 0.5;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #526173;
        text-align: left;
        padding-left: 83px;
        margin-bottom: 0;
    }

    .balance-info2 {
        opacity: 0.5;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #526173;
        text-align: left;
        padding-left: 72px;
        margin-bottom: 0;
    }

    .faucet-balance-link {
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.14;
        letter-spacing: normal;
        color: #307087;
        padding-left: 67px;
    }

    .balance-wrapper {
        margin-bottom: 50px;
    }

    .margintop-10 {
        margin-top: 10px;
    }

    .margintop-40 {
        margin-top: 40px;
    }

    a {
        color: #42b983;
        text-decoration: none;
    }

    .field {
        background-color: #ebeef5;
        padding: 7px 10px;
        font-size: 16px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #526173;
        border: none;
        line-height: 30px;
        height: 45px;
    }

    .first-radius{
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
    }

    .second-radius{
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
    }


    .jobs-running {
        display: flex;
        justify-content: space-between;
        border-radius: 4px;
        background-color: #ebeef5;
        border: solid 1px #dcdfe6;
        padding: 7px 10px;
        margin-bottom: 10px;
    }

    .right-balance {
        /*padding-left: 20px;*/
    }

    h3 {
        margin-bottom: 40px !important;
    }

    .little-span {
        font-size: 12px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 30px;
        letter-spacing: normal;
        color: #526173;
        margin-right: 10px;
    }

    .inline {
        display: inline-block;
    }

    .balance {
        display: flex;
        align-content: center;
        margin-top: 3px;
    }

    .margin-10 {
        margin-bottom: 10px;
    }

    .margin-20 {
        margin-bottom: 20px;
    }

    .account-headline{
        color: #1a4559;
    }

    .lead-paragraph{
        color: #526173;
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
</style>
