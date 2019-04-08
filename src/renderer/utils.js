export default {
  buildNodeSocketUrl: (credentials) => {
    if (!('inputIp' in credentials) || !('inputPort' in credentials) ||
      !('secured' in credentials)) {
      throw Error(`Invalid credentials object. ${JSON.stringify(credentials)}`);
    }

    if (credentials.secured) {
      return `https://${credentials.inputIp}:${credentials.inputPort}`;
    }
    return `http://${credentials.inputIp}:${credentials.inputPort}`;
  },
  buildNodeApiUrl: (credentials, config) => {
    if (!('inputIp' in credentials) || !('inputPort' in credentials) ||
      !('secured' in credentials)) {
      throw Error(`Invalid credentials object. ${JSON.stringify(credentials)}`);
    }

    if (!('node_rpc_port' in config)) {
      throw Error('Node RPC port is missing in configuration.');
    }

    if (credentials.secured) {
      return `https://${credentials.inputIp}:${config.node_rpc_port}`;
    }
    return `http://${credentials.inputIp}:${config.node_rpc_port}`;
  },
};
