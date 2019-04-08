const state = {
  otnode: {},
  config: {},
  ip: '',
  port: '',
};

const mutations = {
  ADD_CONFIG(state, value) {
    state.config = value;
  },
  ADD_NODE(state, value) {
    state.otnode = value;
  },
  ADD_IP(state, value) {
    state.ip = value;
  },
  ADD_PORT(state, value) {
    state.port = value;
  },
  ADD_PASSWORD(state, value) {
    state.password = value;
  },
};

const actions = {
  someAsyncTask({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER');
  },
};

export default {
  state,
  mutations,
  actions,
};
