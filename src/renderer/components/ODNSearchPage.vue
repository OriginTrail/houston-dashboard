<template>
    <el-col class="wrapper">
        <div class="el-row">
            <div class="el-col">
                <h1 class="odn-headline">ODN Search</h1>
            </div>
        </div>
        <div class="el-row">
            <div class="el-col">
                <p class="lead-paragraph">
                    The place to find and read datasets from the ODN. Use the search bar to enter a query and see how the ODN network finds results both in your local storage and also on the ODN network.
                </p>
            </div>
        </div>

        <el-row>
            <el-col :span="19">
                <el-row class="margin-30" v-for="(inputs, index) in this.inputs" :key="inputs.key" :span="21">
                    <el-col :span="6">
                        <label for="input-identifier">Identifier</label>
                        <el-input id="input-identifier" :disabled="disabled == true" placeholder="identifiers.id" v-model="inputs.path"></el-input>
                    </el-col>
                    <el-col :span="5" class="select_input">
                        <label for="input-rule" class="rule-label">Rule</label>
                        <el-select id="input-rule" v-model="inputs.opcode" placeholder="Select" :disabled="disabled == true">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <label for="input-value">Value</label>
                        <el-input if="input-value" placeholder="urn:epc:id:sgtin..." :disabled="disabled == true" v-model="inputs.value"></el-input>
                    </el-col>
                    <el-col :span="5" class="plus-minus-odn">
                        <el-button @click="addInput()" class="importxml-button " :disabled="disabled == true">
                            <i class="el-icon-circle-plus"></i>
                        </el-button>
                        <el-button @click="removeInput(inputs)" class="importxml-button " :disabled="disabled == true">
                            <i class="el-icon-remove"></i>
                        </el-button>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="5">
                <el-col :span="3">
                    <el-button @click="runQuery()" class="importxml-button marginright-10 search-wrapper" :disabled="disabled == true">Search</el-button>
                </el-col>
            </el-col>
        </el-row>


        <el-row style="margin-top: 20px;">
            <el-col :span="12">
                <div class="el-row">
                    <div class="el-col">
                        <h3>LOCAL SEARCH</h3>
                    </div>
                </div>
                <el-row>
                    <el-col>
                        <p class="search-description">
                            If there is data about this identifier on your node it will show up here.
                        </p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-table
                                :data="localData"
                                v-loading="loadingLocal">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <p class="search-p">Data provider wallet: {{ scope.row.data_provider_wallet }}</p>
                                    <p class="search-p">Import Id: {{ scope.row.data_set_id }}</p>
                                </template>
                            </el-table-column>
                            <el-table-column width="150">
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <div class="el-row">
                    <div class="el-col">
                        <h3>ODN NETWORK SEARCH</h3>
                    </div>
                </div>
                <el-row>
                    <el-col>
                        <p class="search-description">
                            List of nodes on the network and their reading offers
                        </p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-table
                                :data="networkResponses"
                                style="width: 100%"
                                v-loading="loadingNetwork">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <el-row>
                                        <el-col :span="19">
                                            <p class="search-p">Calculated price: {{ scope.row.calculated_price }}</p>
                                            <p class="search-p">Import Id: {{ scope.row.data_set_id }}</p>
                                            <p class="search-p">Size: {{ scope.row.size }}</p>
                                        </el-col>
                                        <el-col :span="5">
                                            <el-button v-if="scope.row.status == 'Get'" class="graph-button" @click="readData(scope.row.query_id, scope.row.reply_id, scope.row.data_set_id, scope.row.status)">
                                                Get
                                            </el-button>
                                            <div  v-else-if="scope.row.status == 'Owned'" class="statusRead">
                                                <i class="el-icon-circle-check" style="color: #1a4559"></i>
                                                {{ scope.row.status }}
                                            </div>
                                            <div v-else class="statusRead">
                                                <i class="el-icon-loading"></i>
                                                {{ scope.row.status }}
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </el-col>
</template>

<script>
    import Menu from './Menu';
    import utils from '../utils';
    export default {
      name: 'odnsearch',
      components: { Menu },
      sockets: {
        imports(val) {
          this.imports = val.reverse();
        },
        readNotification(data) {
          const { dataSetId, queryId, replyId } = data;
          this.networkResponses.filter(
            dataset => dataset.data_set_id === dataSetId).forEach((dataset) => {
            dataset.status = 'Owned';
          });
        },
        purchaseFinished(val) {
          this.$notify({
            title: val.data,
            message: '',
            type: 'success',
            iconClass: 'el-icon-success',
          });
        },
        localDataResponses(val) {
          val.forEach((row, index) => {
            const responseObject = val[index];
            this.localData.push(responseObject);
          });
          this.loadingLocal = false;
        },
      },
      mounted() {
        EventBus.$on('no-offers-for-query', () => {
          this.loadingNetwork = false;
        });

        EventBus.$on('answer-not-found', () => {
          this.loadingNetwork = false;
          this.disabled = false;
        });

        db.findOne({ _id: 'credentials' }, (err, credentials) => {
          this.credentials = credentials;
          db.find({ _id: 'config' }, (err, docs) => {
            this.baseUrl = utils.buildNodeApiUrl(this.credentials, docs[0].config);
          });
        });
      },
      data() {
        return {
          config: '',
          activeName: 'first',
          ident: '',
          loadingNetwork: false,
          loadingLocal: false,
          disabled: false,
          inputIp: '',
          importIds: [],
          baseUrl: '',
          port: '',
          options: [{
            value: 'EQ',
            label: 'Exact Match',
          }],
          networkResponses: [],
          localData: [],
          imports: [],
          inputs: [{
            key: Date.now(),
            path: '',
            value: '',
            opcode: '',
          }],
          operator: '',
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
        handleClick(tab, event) {
          console.log(tab, event);
        },
        runQuery() {
          let invalidQuery = false;
          this.inputs.forEach((input, index) => {
            if (input.path.length === 0
              || input.opcode.length === 0
              || input.value.length === 0) {
              invalidQuery = true;
            }
          });

          if (invalidQuery) {
            this.$notify.info({
              title: 'Missing query parameters',
              message: 'Please fill all search parameters!',
              duration: 5000,
            });
            return;
          }

          this.$notify.info({
            title: 'Searching the network..',
            message: 'Please wait!',
            duration: 30000,
          });
          const queryData =
                { query: this.inputs };
          let inputIp;

          this.loadingNetwork = true;
          this.loadingLocal = true;
          this.disabled = true;


          axios.post(`${this.baseUrl}/api/query/network`, queryData)
            .then((response) => {
              const queryId = response.data.query_id;

              setTimeout(() => {
                axios.get(`${this.baseUrl}/api/query/${queryId}/responses`)
                  .then((response) => {
                    const dataObject = response.data;
                    dataObject.forEach((row, index) => {
                      const { datasets } = dataObject[index];
                      const replyIdUp = dataObject[index].reply_id;
                      datasets.forEach((row, index) => {
                        const localData = this.localData;
                        if (!localData.find(element =>
                          element.data_set_id === datasets[index].data_set_id)) {
                          datasets[index].status = 'Get';
                        } else {
                          datasets[index].status = 'Owned';
                        }

                        datasets[index].reply_id = replyIdUp;
                        datasets[index].query_id = queryId;

                        this.networkResponses.push(datasets[index]);
                        this.loadingNetwork = false;
                      });
                    });
                  });
              }, 60000);
            })
            .catch((e) => {
              this.errors.push(e);
            });


          axios.post(`${this.baseUrl}/api/query/local`, queryData)
            .then((response) => {
              const importIdObject = response.data;

              if (importIdObject && Array.isArray(importIdObject)) {
                importIdObject.forEach((row, index) => {
                  this.$socket.emit('get-local-query-responses', importIdObject[index]);
                });
              } else {
                this.loadingLocal = false;
              }
            })
            .catch((e) => {
              console.log(e);
            });
        },
        viewImport(importId) {
          this.$router.push({ name: 'visualisation', params: { importId } });
        },
        addInput() {
          this.inputs.push({
            key: Date.now(),
            path: '',
            value: '',
            opcode: '',
          });
        },
        removeInput(item) {
          if (this.inputs.length === 1) {
            return;
          }
          const index = this.inputs.indexOf(item);
          if (index !== -1) {
            this.inputs.splice(index, 1);
          }
        },
        handleClose(done) {
          this.$confirm('Are you sure to close this dialog?')
            .then((_) => {
              done();
            })
            .catch((_) => {});
        },
        readData(queryId, replyId, datasetId, status) {

          this.networkResponses.forEach((row, index) => {
            if (this.networkResponses[index].data_set_id === datasetId) {
              this.networkResponses[index].status = 'In progress';
            }
          });

          const readData = {
            query_id: queryId,
            reply_id: replyId,
            data_set_id: datasetId,
          };


          axios.post(`${this.baseUrl}/api/read/network`, readData)
            .then((response) => {
              if (response.status === 200) {
                this.$notify({
                  title: 'Read..',
                  message: response.data.message,
                  type: 'success',
                });
              }
            })
            .catch((e) => {
              console.log(e);
              // this.errors.push(e);
            });
        },
      },
    };
</script>

<style scoped>
    .el-table .cell {
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }

    .search-p {
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }

    .graph-button {
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #2d095e;
        border: solid 1px #090932;
        padding: 5px 7px;
        border-radius: 0;
    }

    .offerStatus {
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.67;
        letter-spacing: normal;
        color: #090932;
        border: none;
        padding: 5px 7px !important;
        margin-top: 22%;
    }

    .search-description {
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #526173;
        margin: 0 0 32px 0;
        height: 32px;
    }



    .importxml-button {
        background-color: #090932;
        color: white;
    }

    .select_input {
        margin: 0 10px;
    }

    .marginright-10 {
        margin-left: 10px;
    }

    .offer-button {
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        color: white;
        border: solid 1px #090932;
        padding: 5px 7px;
        background-color: #090932;
        border-radius: 0;
    }

    .el-loading-mask {
        padding-left: 91px;
        background-color: white;
    }

    .loading-screen {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-top: 40px;
    }

    .statusRead {
        padding-top: 21px;
        padding-left: 28px;
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
    .one { animation-delay: 0.2s; }
    .two { animation-delay: 0.4s; }
    .three { animation-delay: 0.6s; }


    @keyframes showHideDot {
        0% { opacity: 0; }
        50% { opacity: 1; }
        60% { opacity: 1; }
        100% { opacity: 0; }
    }

    .plus-minus-odn{
        margin-left: 20px;
        margin-top: 19px;
    }

    .search-wrapper{
        margin-top: 19px;
    }

    .rule-label{
        display: block;
    }

    .odn-headline{
        font-size: 36px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #1a4559;
    }
</style>

