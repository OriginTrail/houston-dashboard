<template>
    <div class="">
            <el-row class="import-button-section">
                <el-col :span="24">
                    <el-upload
                            class="upload-demo"
                            :action="url"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :auto-upload="true"
                            name="importfile"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            :data="addData">
                        <el-button size="small" class="importxml-button">Import XML</el-button>
                        <!--<div slot="tip" class="el-upload__tip">XML files according to GS1 standard. For more info check the example and documentation.</div>-->
                    </el-upload>
                </el-col>
            </el-row>
        </div>
</template>

<script>
  import Menu from './Menu';
  import util from '../utils';
  export default {
    name: 'import',
    components: { Menu },
    mounted() {
      db.find({ _id: 'config' }, (err, docs) => {
        db.findOne({ _id: 'credentials' }, (err, credentials) => {
          const baseUrl = util.buildNodeApiUrl(credentials, docs[0].config);
          this.url = `${baseUrl}/api/import`;
        });
      });
    },
    sockets: {
      importRequestData(val) {
        this.$notify({
          title: 'Importing XML file...',
          message: 'Please be patient.',
          iconClass: 'el-icon-loading',
        });
      },
      importFailed(val) {
        this.$notify.error({
          title: 'XML Import rejected.',
          message: '',
          type: 'error',
          iconClass: 'el-icon-error',
        });

      },
      importSucceeded(val) {
        this.$notify({
          title: 'XML Imported',
          message: '',
          type: 'success',
          iconClass: 'el-icon-download',
        });
        EventBus.$emit('import-succeded');

        this.$socket.emit('get-imports');
      },
    },
    data() {
      return {
        url: '',
        fileList: [],
        inputIp: '',
        finalIp: '',
        addData: {
          importtype: 'GS1',
        },
        headers: {
          'Content-Type': 'text/plain',
        },
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`Remove ${file.name}？`);
      },
    },
  };
</script>

<style>
    .importxml-button {
        background-color: #090932;
        color: white;
    }

    .import-button-section {
        margin: 20px 0;
    }
</style>

