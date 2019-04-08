<template>
    <div class="">
        <!--<div class="title margin-bottom-40">-->
        <!--Your imports-->
        <!--</div>-->
        <el-row>
            <el-col :span="24">
                <data-tables :data="tableData" @selection-change="handleSelectionChange">
                    <el-table-column type="expand" fixed @click="props.row.showOffers += 5">
                        <template slot-scope="props">

                            <p class="offer-message" v-if="props.row.offers.length == 0">No offers were created</p>

                            <div v-if="props.row.offers.length > 0">
                                <p class="offer-table-title">Offers created for dataset ({{props.row.offers.length}})</p>
                                <table class="offer-table">
                                    <thead>
                                    <tr>
                                        <th style="width: 10px" class="table-headlines id-first">#</th>
                                        <th class="table-headlines">Offer ID</th>
                                        <th class="table-headlines special-table-headline">Message</th>
                                        <th class="table-headlines padding-left">Offer status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr type="expand"  v-for="(offer, index) in props.row.offers.slice().reverse()" v-if="index < props.row.showOffers">
                                        <td>{{props.row.offers.length - index}}</td>
                                        <td>{{offer.offerId || 'Calculating...'}}</td>
                                        <td>{{offer.message}}</td>
                                        <td>
                                            <div class="status-circle" :class="offer.status.toLowerCase()"></div>
                                            <span class="offer-status">{{ offer.status.toLowerCase() }}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div class="offer-list">
                                    <span @click="props.row.showOffers += 5" v-if="props.row.offers.length > props.row.showOffers ">&#9660;</span>
                                    <span @click="props.row.showOffers -= 5" v-if="props.row.showOffers > 5">&#9650;</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="Date"
                            width="150"
                            sortable="custom">
                        <template slot-scope="props">
                            {{ timestampParse(props.row.import_timestamp) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label=""
                            width="60">
                        <template slot-scope="props">
                            <div class="hexContainer" id="hexContainerID">
                                <div v-html="props.row.pic"
                                     style="border-radius: 50px; overflow: hidden; padding: 0px; margin: 0px; width: 30px; height: 30px; display: inline-block; background: rgb(1, 109, 142);">

                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="data_set_id"
                            label="Dataset ID"
                            sortable="custom">
                    </el-table-column>
                    <el-table-column
                            label="Actions"
                            width="270">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.status === 'Create offer'" class="offer-button"
                                       @click="createOfferDialog(scope.row.data_set_id)">
                                {{ scope.row.status }}
                            </el-button>
                            <el-button v-else-if="scope.row.status === 'Offer finalized'" class="offerStatus">
                                <i class="el-icon-check"></i>
                                {{ scope.row.status }}
                            </el-button>
                            <el-button v-else-if="scope.row.status === 'Offer canceled'" class="offerStatus">
                                <i class="el-icon-close"></i>
                                {{ scope.row.status }}
                            </el-button>
                            <el-button v-else class="offerStatus" @click="dialogVisible = false">
                                <i class="el-icon-loading" v-if="scope.row.status !== 'Offer finalized'"></i>
                                {{ scope.row.status }}
                            </el-button>
                        </template>
                    </el-table-column>
                </data-tables>

                <el-dialog
                        title="Create offer"
                        :visible.sync="dialogVisible">
                    <el-form :model="form">
                        <el-form-item v-model="form.total_escrow_time_in_minutes" label="Total escrow time">
                            <div class="labels-mini">
                                <el-row>
                                    <el-col :span="6">Months</el-col>
                                    <el-col :span="6">Days</el-col>
                                    <el-col :span="6">Hours</el-col>
                                    <el-col :span="6">Minutes</el-col>
                                </el-row>
                            </div>
                            <el-row>
                                <el-col>
                                    <el-input-number controls-position="right" :min="0" :max="12" size="mini"
                                                     v-model="totalTime.months"></el-input-number>
                                    <el-input-number controls-position="right" :min="0" :max="365" size="mini"
                                                     v-model="totalTime.days"></el-input-number>
                                    <el-input-number controls-position="right" :min="0" :max="24" size="mini"
                                                     v-model="totalTime.hours"></el-input-number>
                                    <el-input-number controls-position="right" :min="0" :max="60" size="mini"
                                                     v-model="totalTime.mins"></el-input-number>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="Token amount per holder (mTRAC)">
                            <el-input v-model="form.max_token_amount_per_dh" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="createOffer()">Confirm</el-button>
  </span>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Menu from './Menu';
    import utils from '../utils';

    export default {
      name: 'imports',
      components: { Menu },
      data() {
        return {
          tableData: [],
          databaseID: '',
          changeCreateOffer: true,
          dialogVisible: false,
          loading: false,
          config: '',
          form: {
            total_escrow_time_in_minutes: '',
            dc_litigation_interval_in_minutes: '',
            dh_min_stake_amount: '',
            max_token_amount_per_dh: '',
            import_id: '',
          },
          totalTime: {
            days: '',
            hours: '',
            mins: '',
            months: '',
          },
          filters: [{
            prop: 'flow_no',
            value: '',
          }],
          titles: [{
            prop: 'id',
            label: 'NO.',
          }, {
            prop: 'data_set_id',
            label: 'Dataset ID',
          }, {
            prop: 'pic',
            label: '',
          }, {
            prop: 'import_timestamp',
            label: 'Date',
          }],
          selectedRow: [],
          headers: {
            'Content-Type': 'text/plain',
          },
        };
      },
      mounted() {
        this.$socket.emit('get-imports');
        if (this.tableData === []) {
          this.loading = true;
        } else {
          this.loading = false;
        }


        setTimeout(() => {
          this.tableData.forEach((row, index) => {

            if (this.tableData[index].status === 'Fingerprint written') {
              this.tableData[index].status = 'Create offer';
            }
          });
        }, 3000);


        EventBus.$on('import-succeded', () => {
          this.tableData = [];
        });

        db.findOne({ _id: 'credentials' }, (err, doc) => {
          this.credentials = doc;
        });

        db.find({ _id: 'config' }, (err, docs) => {
          this.config = docs[0].config;
          let timeEscrow = docs[0].config.dc_holding_time_in_minutes * 60 * 1000;

          const months = Math.trunc(timeEscrow / 2592000000);
          timeEscrow %= 2592000000;
          const days = Math.trunc(timeEscrow / 86400000);
          timeEscrow %= 86400000;
          const hours = Math.trunc(timeEscrow / 3600000);
          timeEscrow %= 3600000;
          const minutes = Math.trunc(timeEscrow / 60000);

          this.totalTime.months = months;
          this.totalTime.days = days;
          this.totalTime.hours = hours;
          this.totalTime.mins = minutes;
          this.totalTime.days = days;

          const maxTokenAmountperDh = docs[0].config.dc_token_amount_per_holder;
          const dhMinStakeAmount = docs[0].config.dh_min_stake_amount;
          const dhMinReputation = docs[0].config.dc_litigation_interval_in_minutes;

          this.form.total_escrow_time_in_minutes = minutes;
          this.form.max_token_amount_per_dh = maxTokenAmountperDh;
          this.form.dh_min_stake_amount = dhMinStakeAmount;
          this.form.dc_litigation_interval_in_minutes = dhMinReputation;
        });
      },
      computed: {
        timestampMoment(value) {
          return this.$moment(value).fromNow();
        },
        setDHReputationType(value) {
          const converted = parseInt(value, 10);
          return converted;
        },
        max_token_amount_per_dh() {
          return this.form.max_token_amount_per_dh;
        },
      },
      watch: {
        max_token_amount_per_dh(val) {

        },
      },
      sockets: {
        imports(val) {
          // eslint-disable-next-line
                val.forEach((row, index) => {
            val[index].status = 'Create offer';
            const datasetID = val[index].data_set_id;
            const datasetIDSubstr = datasetID.substring(0, 15);
            const wrapper = document.createElement('div');
            const picHTML = jazzicon(30, Web3Utils.hexToNumber(datasetIDSubstr));
            wrapper.appendChild(picHTML);
            val[index].pic = wrapper.innerHTML;
            val[index].offers = [];
            const single = val[index];
            db.find({ 'single.data_set_id': datasetID }, (err, docs) => {
              if (docs.length === 0) {
                db.insert({ single }, (err, docs) => {
                  docs.single.showOffers = 5;
                  this.tableData.unshift(docs.single);
                  this.$socket.emit('get-offers', datasetID);
                });
              } else {
                docs[0].single.showOffers = 5;
                this.tableData.unshift(docs[0].single);
                this.$socket.emit('get-offers', datasetID);
              }
            });
          });
        },
        offers(val) {
          const { datasetId, offers } = val;
          const dataRow = this.tableData.find((row) => {
            return row.data_set_id === datasetId;
          });
          dataRow.offers = offers;

          db.update({ 'single.data_set_id': datasetId }, { $set: { 'single.offers': offers } }, { multi: true }, (err, numReplaced) => {
            if (err) {
              console.err(err);
            }
          });
        },
        offerUpdate(offer) {
          this.handleOfferInsertOrUpdate(offer);
        },
      },
      filters: {
        Truncate(value) {
          const after = value.substr(20);
          const res = after.replace(after, '...');

          return res;
        },
        Moment(value) {
          return this.$moment(value).fromNow();
        },
      },
      methods: {
        viewImport(importId) {
          this.$router.push({ name: 'visualisation', params: { import_id: importId } });
        },
        createOfferDialog(importId) {
          this.dialogVisible = true;
          this.form.data_set_id = importId;
        },
        timestampParse(value) {
          return this.$moment(value).fromNow();
        },
        changeStatus() {
          if (this.changeCreateOffer === true) {
            this.tableData[index].status = 'Create offer';
          }
          return this.tableData[index].status;
        },
        createOffer() {
          this.dialogVisible = false;
          this.offerStatus = false;
          this.changeCreateOffer = false;
          const createOfferObject = this.form;

          const months = this.totalTime.months;
          const monthsToMinutes = months * 31 * 24 * 60;
          const days = this.totalTime.days;
          const daysToMinutes = days * 24 * 60;
          const hours = this.totalTime.hours;
          const hoursToMinutes = hours * 60;
          const minutes = this.totalTime.mins;

          const totalEscrowTime = monthsToMinutes + daysToMinutes + hoursToMinutes + minutes;

          const newcreateOfferObject = {
            data_set_id: this.form.data_set_id,
            holding_time_in_minutes: totalEscrowTime,
            token_amount_per_holder: this.form.max_token_amount_per_dh,
            litigation_interval_in_minutes: this.form.dc_litigation_interval_in_minutes,
          };


          const baseUrl = utils.buildNodeApiUrl(this.credentials, this.config);
          axios.post(`${baseUrl}/api/replication`, newcreateOfferObject)
            .then((response) => {
              this.$notify({
                title: 'Offer data',
                message: response.statusText,
                type: 'success',
              });
            })
            .catch((e) => {
              console.log(e);
            });
        },
        handleClose(done) {
          this.$confirm('Are you sure to close this dialog?')
            .then((_) => {
              done();
            })
            .catch((_) => {
            });
        },
        onCreate() {
          this.data.push({
            content: 'new created',
            flow_no: `FW201601010003${Math.floor(Math.random() * 100)}`,
            flow_type: 'Help',
            flow_type_code: 'help',
          });
        },
        handleOfferInsertOrUpdate(updatedOffer) {
          let found = false;
          this.tableData.forEach((dataset, index) => {
            dataset.offers.forEach((offer, index) => {
              if (offer.replicationId === updatedOffer.replicationId) {
                found = true;
                dataset.offers[index] = updatedOffer;
                dataset.offers.push(...[]);
                let type = 'success';
                if (updatedOffer.status === 'FAILED') {
                  type = 'error';
                }
                this.$notify({
                  message: `Status update for offer ${updatedOffer.offerId || ''}: ${updatedOffer.message}`,
                  type,
                });
              }
            });
          });

          if (!found) {
            const dataset = this.tableData.find(
              dataset => dataset.data_set_id === updatedOffer.datasetId);
            dataset.offers.push(updatedOffer);
          }


          db.find({ 'single.data_set_id': updatedOffer.datasetId }, (err, docs) => {
            if (docs.length === 0) {
              // TODO handle exception
            } else {
              const doc = docs[0];
              const offers = doc.single.offers;
              const index = offers.findIndex(o => o.replicationId === updatedOffer.replicationId);

              if (index === -1) {
                db.update({ 'single.data_set_id': updatedOffer.datasetId }, { $push: { 'single.offers': updatedOffer } }, {}, (err, res) => {
                  if (err) {
                    console.err(err);
                  } else {
                    console.log(res);
                  }
                });
                return;
              }

              const updateCon = { $set: {} };
              updateCon.$set[`single.offers.${index}`] = updatedOffer;

              db.update({ 'single.data_set_id': updatedOffer.datasetId }, updateCon, { multi: true }, (err, numReplaced) => {
                if (err) {
                  console.err(err); // TODO handle exception
                }
              });
            }
          });
        },
        handleSelectionChange(val) {
          this.selectedRow = val;
        },
      },

    };
</script>

<style scoped>
    .margintop-30 {
        margin-top: 30px;
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
        border-radius: 2px;
        opacity: .5;
    }

    .graph-icon {
        width: 12px;
    }

    .el-input-number--mini {
        width: 95px;
    }

    .el-dialog {
        width: 432px !important;
    }

    .hexContainer {
        width: 40px;
        height: 40px;
        overflow: hidden !important;
        padding-top: 4px;
    }

    #hexContainerID > div > svg {
        position: static !important;
        left: inherit;
        height: 30px;
        width: 30px;
    }

    .left-info-block {
        opacity: 0.5;
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 2.5;
        letter-spacing: normal;
        color: #526173;
        border-right: 1px solid #ced2d7;
        margin-top: 0;
        margin-left: 15px;
        height: 35px;
    }

    .info-block {
        border-radius: 4px;
        background-color: #ffffff;
        border: solid 1px #ced2d7;
        margin: 10px 0;
        height: 36px;
    }

    .right-block-info {
        font-size: 12px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 2.9;
        letter-spacing: normal;
        color: #526173;
        margin-left: 14px;
        height: 35px;
        margin-top: 0;
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
        padding: 0;
        padding-left: 5px;
        cursor: not-allowed;
    }

    svg.circle {
        margin-left: 44%;
    }

    .frame {
        width: 30px;
        height: 30px;
        overflow: hidden;
    }

    .labels-mini {
        width: 100%;
        font-size: 12px;
        opacity: 0.7;
    }

    .el-form-item__label {
        width: 100% !important;
        text-align: left !important;
    }

    .offer-button {
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        color: white;
        border: solid 2px #090932;
        padding: 5px 7px;
        background-color: #090932;
        border-radius: 2px;
    }

    .el-loading-mask {
        padding-left: 40%;
        height: 134px;
    }

    .h2-imports {
        font-size: 12px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 2;
        letter-spacing: 3.6px;
        color: #1a4559;
        text-transform: uppercase;
    }

    .offer-table {
        margin-top: 20px;
        border-collapse: collapse;
        cursor: default;
    }
    th{
        font-size: 12px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
        color: #314359
    }



    .table-headlines{
        font-size: 12px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.67;
        letter-spacing: normal;
        color: #314359;
    }

    td{
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.67;
        letter-spacing: normal;
        color: #314359;
    }

    .offer-table tr:hover {
        background-color: #f0f8fd;
        transition: 0.2s;
    }

    .offer-table td, .offer-table th {
        padding: 10px 5px;
        font-size: 12px;
        /*min-width: 60px;*/
    }

    .offer-table-title {
        margin-left: 20px;
        font-weight: bold;
        font-size: 12px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 2;
        letter-spacing: 3.6px;
        color: #1a4559;
        text-transform: uppercase;
    }

    .offer-status {
        text-transform: capitalize;
        font-weight: bold;
        color: gray;
        cursor: pointer;
        display: inline-block;
    }

    .status-circle {
        width: 10px;
        height: 10px;
        border-radius: 50px;
        display: inline-block;
        margin-right: 5px;
    }

    .status-circle.failed {
        background-color: #cc2929;
    }

    .status-circle.prepared,.status-circle.published,.status-circle.started,.status-circle.choosing,.status-circle.mined {
        background-color: orange;
    }

    .status-circle.finalized {
        background-color: #5cb85c;
    }
    .id-first{
        max-width: 20px !important;
        min-width: 15px !important;
    }

    .offer-list {
        text-align: center;
        margin-top: 10px;
    }

    .offer-list span {
        color: blue;
        cursor: pointer;
        font-weight: bold;
        padding: 0px 10px;
        color: #d0d0d0;
        width: 100px;
        display: inline-block;
    }

    .offer-list span {
        color: blue;
        cursor: pointer;
        font-weight: bold;
        padding: 0px 10px;
        color: #d0d0d0;
    }

    .offer-list span:hover {
        color: blue;
        color: #57aaff;
    }

    .special-table-headline{
        width: 170px;
    }

    .padding-left{
        padding-left: 20px !important;
    }

</style>

