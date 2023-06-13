import axios from "axios";
const URL = "http://localhost:4001";

export const ConnectToDbs = async (data) => {
  let query = `${URL}/Connecting`;
  let params = data;
  const encodedDatabases = encodeURIComponent(JSON.stringify(params.databases));
  params.databases = encodedDatabases;
  console.log(params);
  try {
    const response = await axios.get(query, { params: params });
    if (response) {
      return response;
    } else {
      console.log("no data found !!!!!!");
    }
  } catch (error) {
    console.log("Error while calling SearchInDbs api", error);
  }
};

export const deleteFromAllDb = async (parametres) => {
  let query = `${URL}/Deleting`;
  //const encodedDatabases = encodeURIComponent(JSON.stringify(para.connectionToDBs));
  //let params = {cin:para.cin,databases:encodedDatabases};
  console.log(JSON.stringify(parametres));
  try {
    const response = await axios.delete(query, { params: parametres });
    if (response) {
      return response;
    } else {
      console.log("delete Failed !!!!!!");
    }
  } catch (error) {
    console.log("Error while calling delete api", error);
  }
};

export const getLastOperations = async (email) => {
  let query = `${URL}/lastOperations`;

  const response = await axios.get(query, { params: { email: email } });
  if (response) {
    return response;
  } else {
    console.log("loading lastOperations failed !!!!!!!!!");
  }
};

export const getHistory = async (email) => {
  let query = `${URL}/history`;

  const response = await axios.get(query, { params: { email: email } });
  if (response) {
    return response;
  } else {
    console.log("loading history failed !!!!!!!!!");
  }
};

export const connectUser = async (login) => {
  let query = `${URL}/Login`;
  const response = await axios.post(query, login);
  if (response) {
    return response;
  } else {
    console.log("login failed !!!!!!!!!");
  }
};
export const createAcount = async (acount) => {
  let query = `${URL}/CreateAccount`;
  const response = await axios.post(query, acount);
  if (response) {
    return response;
  } else {
    console.log("sign in  failed !!!!!!!!!");
  }
};

export const restoreData = async (data, user) => {
  let query = `${URL}/restore`;
  const response = await axios.post(query, { data: data, user: user });
  if (response) {
    return response;
  } else {
    console.log("restore failed !!!!!!!!!");
  }
};

export const deleteHistory = async (data, user) => {
  let query = `${URL}/deleteFromHistory`;
  const response = await axios.post(query, { data: data, user: user });
  if (response) {
    return response;
  } else {
    console.log("delete from history failed !!!!!!!!!");
  }
};

export const addDbStep1 = async (databasePara, user) => {
  let query = `${URL}/addDatabase_Step1`;
  const response = await axios.post(query, {
    database: databasePara,
    user: user,
  });
  if (response) {
    return response;
  } else {
    console.log("step 1 from add database  failed !!!!!!!!!");
  }
};
export const AddDatabase = async (
  databasePara,
  selectedDatabase,
  informations,
  user
) => {
  let query = `${URL}/addDatabase_submit`;
  const response = await axios.post(query, {
    databasePara: databasePara,
    selectedDatabase: selectedDatabase,
    informations: informations,
    user: user,
  });
  if (response) {
    return response;
  } else {
    console.log("addDatabase_submit   failed !!!!!!!!");
  }
};

export const getDatabaseInfo = async (user) => {
  let query = `${URL}/getDatabaseInfo`;
  const response = await axios.post(query, user);
  if (response) {
    return response;
  } else {
    console.log("getDatabaseInfo   failed !!!!!!!!");
  }
};

export const deleteDatabaseService = async (elm, user) => {
  let query = `${URL}/deleteDatabaseService`;
  const response = await axios.post(query, { database: elm, user: user });
  if (response) {
    return response;
  } else {
    console.log("deleteDatabaseService failed !!!!!!!!");
  }
};

export const accesToDB = async (elm, table, user) => {
  let query = `${URL}/accesToDB`;
  const response = await axios.post(query, {
    database: elm,
    user: user,
    table: table,
  });
  if (response) {
    return response;
  } else {
    console.log("accesToDB failed !!!!!!!!");
  }
};

export const addToDB = async (elm, parametres, table, sheetName) => {
  let query = `${URL}/addToDB`;
  const response = await axios.post(query, {
    elm,
    parametres,
    table,
    sheetName,
  });
  if (response) {
    return response;
  } else {
    console.log("addToDB failed !!!!!!!!");
  }
};

export const deleteFromDb = async (elm, parametres, table, user, sheetName) => {
  let query = `${URL}/deleteFromDb`;
  const response = await axios.post(query, {
    elm,
    parametres,
    table,
    user,
    sheetName,
  });
  if (response) {
    return response;
  } else {
    console.log("deleteFromDb failed !!!!!!!!");
  }
};

export const updateDb = async (
  data,
  paramtres,
  table,
  primaryKey,
  sheetName,
  selectedRow
) => {
  let query = `${URL}/updateDb`;
  const response = await axios.post(query, {
    data: data,
    paramtres: paramtres,
    table: table,
    primaryKey: primaryKey,
    sheetName: sheetName,
    original: selectedRow,
  });
  if (response) {
    return response;
  } else {
    console.log("updateDb failed !!!!!!!!");
  }
};

export const cards = async (email) => {
  let query = `${URL}/cardInfo`;
  const response = await axios.get(query, { params: { email: email } });
  if (response) {
    return response;
  } else {
    console.log("cardInfo  failed !!!!!!!!!");
  }
};


export const demandeProlongement = async (demande,user) =>{
  let query = `https://server-admin-vf.vercel.app/demandeDeProlongation`;
  const response = await axios.post(query,{demande,user});
  if (response) {
    return response;
  } else {
    console.log("cardInfo  failed !!!!!!!!!");
  }
}

export const getNumberSuppression = async(user)=>{
  let query = `${URL}/suppressionRestant`;
  const response = await axios.post(query, user);
  if (response) {
    return response;
  } else {
    console.log("suppressionRestant  failed !!!!!!!!!");
  }
}


export const isactivated = async (user)=>{
  let query = `${URL}/isactivated`;
  const response = await axios.post(query, user);
  if (response) {
    return response;
  } else {
    console.log("isactivated  failed !!!!!!!!!");
  }
}