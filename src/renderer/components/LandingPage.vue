<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/origintrail_purple.png" alt="origin-trail" style="width:350px">
    <main>
      <div class="left-side">
        <span class="title">
          Welcome to your node!
        </span>
        <system-information></system-information>
          <div class="doc">
              <br>
          <router-link to="/dashboard">Node Administration</router-link>
          </div>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">Getting Started</div>
          <p>
            This is remote dashboard for OriginTrail node. Make sure you have node installed. For the instructions take a look at our Wiki at GitHub.
          </p>

          <p>This software (as well as OriginTrailNode is in early alpha release. Use it for testing only. Bugs and issues are quite likely.</p>
          <button @click="open('https://github.com/OriginTrail/ot-node/wiki/')">Read the Docs</button><br><br>
        </div>
        <div class="doc">
          <div class="title alt">Other Resources</div>
          <button class="alt" @click="open('https://origintrail.io/')">OriginTrail website</button>
          <button class="alt" @click="open('https://chat.origintrail.io/')">Rocket Chat</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './SystemInformation';

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    mounted() {
      this.$socket.emit('news', 'nesto');
    },
    sockets: {
      connect() {
        console.log('Node connected');
      },
      system(val) {
        store.commit('ADD_NODE', val);
      },
      config(val) {
        store.commit('ADD_CONFIG', val);
      },
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
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

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
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
</style>
