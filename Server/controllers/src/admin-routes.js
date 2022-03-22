// Bring common classes into scope, and Fabric SDK network class
// const {ROLE_ADMIN, ROLE_DOCTOR, capitalize, getMessage, validateRole, createRedisClient} = require('../utils.js');
const network = require("../Utils/network.js");


exports.createPatient = async (req, res,hospid,DocID_PID_AdminID) => {

        // Set up and connect to Fabric Gateway using the username in header
        const networkObj = await network.connectToNetwork(hospid,DocID_PID_AdminID);

        let {patientId,emailId, firstName, lastName,password, age, phoneNumber} = req.body;
        // The request present in the body is converted into a single json string
        const data = JSON.stringify(patientId,emailId, firstName, lastName,password, age, phoneNumber);
        const args = [data];
        // Invoke the smart contract function

        const createPatientRes = await network.invoke(networkObj, false, 'Admin_createPatient', args);
        if (createPatientRes.error) {
            res.status(400).send(response.error);
           }

        // Enrol and register the user with the CA and adds the user to the wallet.
        const userData = JSON.stringify({hospitalId: hospid, userId: DocID_PID_AdminID});
        const registerUserRes = await network.registerUser(userData);
        if (registerUserRes.error) {
          await network.invoke(networkObj, false,  'Admin_deletePatient', req.body.patientId);
          res.send(registerUserRes.error);
        }

  res.status(201).send(getMessage(false, 'Successfully registered Patient.', req.body.patientId, req.body.password));
};


exports.createDoctor = async (req, res, hospid, AdminID) => {
    // This var are adminId and his hospid
    // const hospid = req.body.hospid;
    // const AdminID = req.body.DocID_PID_AdminID;
    console.log("36",hospid,AdminID);
    const networkObj = await network.connectToNetwork(hospid,AdminID);
    console.log("37",hospid,AdminID);
    
    const new_DocID = req.body;
    const emailId= req.body;
    const firstName= req.body;
    const lastName = req.body;
    const password = req.body;
    const age= req.body;
    const phoneNumber= req.body;
    const Fields = req.body;
    console.log("50",new_DocID);
    // if (!('doctorId' in req.body) || req.body.doctorId === null || req.body.doctorId === '') {
    //   const lastId = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:getLatestPatientId');
    //   req.body.patientId = 'PID' + (parseInt(lastId.slice(3)) + 1);
    // }
    const DocID = parseInt(new_DocID);

    const data = JSON.stringify(DocID,emailId, firstName, lastName,password, age,phoneNumber,Fields);
        const args = [data];
    const createDoctorRes = await network.invoke(networkObj, false, 'Admin_createDoctor', args);
        // if (createDoctorRes.error) {
        //     res.status(400).send(response.error);
        //  }


    
    // Enrol and register the user with the CA and adds the user to the wallet.
    const userData = JSON.stringify({hospitalId: hospid, userId: new_DocID});
    const registerUserRes = await network.registerUser(userData);
    if (registerUserRes.error) {
      await network.invoke(networkObj, false, 'Admin_deleteDoctor', userData);
      res.send(registerUserRes.error);
    }

    res.status(201).send(getMessage(false, 'Successfully registered Doctor.', DocID_PID_AdminID,emailId, firstName, lastName,password, age,phoneNumber,Fields, password));
};


exports.getAllPatients = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_ADMIN, ROLE_DOCTOR], userRole, res);
  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:queryAllPatients', userRole === ROLE_DOCTOR ? req.headers.username : '');
  const parsedResponse = await JSON.parse(response);
  res.status(200).send(parsedResponse);
};


exports.readPatient = async (req,res) => {
    
};
