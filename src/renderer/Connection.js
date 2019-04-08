class Connection {
  /**
    * Check credentials
    * @returns {Promise<any>}
    */
  static checkCredentials() {
    return new Promise((resolve, reject) => {
      db.find({ _id: 'credentials' }, (err, docs) => {
        if (docs.length > 0) {
          const inputPort = docs[0].inputPort;
          const inputIp = docs[0].inputIp;
          const password = docs[0].password;
          const secured = docs[0].secured;
          resolve({ inputPort, inputIp, password, secured });
        } else {
          resolve(false);
        }
      });
    });
  }
}

export default Connection;
