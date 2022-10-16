const { getDatabase } = require("firebase-admin/database");

const taskCollection = taskId => {
    const db = getDatabase();
    if (taskId) {
        return db.ref(`server/pocket-wallet/${taskId}`);
    }else{
        return db.ref('server/pocket-wallet/');
    }
    // const taskRef = ref.child('tasks')
}

const skillCollection = (skillId) => {
  const db = getDatabase();
  if (skillId) {
    return db.ref(`server/pocket-wallet/skills/${skillId}`);
  } else {
    return db.ref("server/pocket-wallet/skills");
  }
};

const mediaCollection = (projectId) => {
  const db = getDatabase();
  if (projectId) {
    return db.ref(`server/pocket-wallet/media/${projectId}`);
  } else {
    return db.ref("server/pocket-wallet/media");
  }
};

const userCollection = (userId) => {
    const db = getDatabase();
    if (userId) {
        return db.ref(`server/pocket-wallet/users/${userId}`);
    }else{
      const refDB = db.ref('server/pocket-wallet/users/');
        return refDB;
    }
}

const transactionCollection = (transactionId) => {
  const db = getDatabase();
  if (transactionId) {
      return db.ref(`server/pocket-wallet/transactions/${transactionId}`);
  }else{
      return db.ref('server/pocket-wallet/transactions');
  }
}

const projectCollection = (projectId) => {
    const db = getDatabase();
    if (projectId) {
        return db.ref(`server/pocket-wallet/projects/${projectId}`);
    }else{
        return db.ref('server/pocket-wallet/projects');
    }
}

const messageCollection = projectId => {
    const db = getDatabase();
    if (projectId) {
        return db.ref(`server/pocket-wallet/messages/${projectId}`);
    }else{
        return db.ref('server/pocket-wallet/messages');
    }
}

module.exports = {
  taskCollection,
  userCollection,
  skillCollection,
  projectCollection,
  mediaCollection,
  messageCollection,
  transactionCollection
};
