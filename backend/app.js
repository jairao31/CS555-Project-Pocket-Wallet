const users = require("./data/users");
const connection = require("./config/mongoConnections");
const { Db } = require("mongodb");
console.log("⚡⚡⚡Server Started⚡⚡⚡");
const main = async () => {
  //======================================1===========================================
  try {
    // returning Id of created User
    var userId = await users.create(
      "The Flash",
      "Hoboken, New Jersey",
      "456-789-0123"
    );
    console.log("The Flash has been added!");
  } catch (e) {
    console.log(e);
  }

  //   //======================================2===========================================
  //   try {
  //     const findUser = await users.get(userId);
  //     console.log(findUser);
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   //======================================3===========================================
  //   try {
  //     var NorthSoulId = await users.create(
  //       "Happy Singh",
  //       "Jersey City, New Jersey",
  //       "201-217-8784"
  //     );
  //     console.log("Happy Singh has been added!");
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   //======================================4===========================================
  //   try {
  //     console.log(await users.getAll());
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   //======================================5===========================================
  //   try {
  //     var Alegrias = await users.create(
  //       "Alegrias",
  //       "San Francisco, California",
  //       "415-929-8888",
  //       "http://www.opentable.com",
  //       "$$$$",
  //       ["Spanish"],
  //       4,
  //       { dineIn: true, takeOut: false, delivery: true }
  //     );
  //     console.log("Alegrias user has been added!");
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   //======================================6===========================================
  //   try {
  //     const findUser = await users.get(Alegrias);
  //     console.log(findUser);
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   //======================================7===========================================
  //   try {
  //     await users.rename(userId, "123-456-7890");
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   //======================================8===========================================
  //   // Log first item with updated value...
  //   try {
  //     const updatedWeb = await users.get(userId);
  //     console.log(updatedWeb);
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   //======================================9===========================================
  //   try {
  //     const removeStatus = await users.remove(NorthSoulId);
  //     console.log(removeStatus);
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   //======================================10==========================================
  //   try {
  //     console.log(await users.getAll());
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   //======================================11==========================================
  //   // Create User with bad parameters
  //   try {
  //     const Paradise = await users.create("Paradise Lounge", " ", "1214567890");
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   //======================================12==========================================
  //   //remove a user that does not exist
  //   try {
  //     const removeStatus = await users.remove("615e71f9fdd1bdf342161b3b");
  //     console.log(removeStatus);
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   //======================================13==========================================
  //   //rename a user that does not exist
  //   try {
  //     await users.rename("615e71f9fdd1bdf342161b3b", "201-989-1293");
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   //======================================14==========================================
  //   //rename a user passing in invalid data for the parameter
  //   try {
  //     await users.rename(userId, "1234-123-12");
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   //======================================15==========================================
  //   //getting a user by ID that does not exist
  //   try {
  //     const checkExist = await users.get("615e71f9fdd1bdf342161b3a");
  //     console.log(checkExist);
  //   } catch (e) {
  //     console.log(e);
  //   }

  const db = await connection();
  db.s.client.close(); // Closing Function
  console.log("Done!");
};

main().catch((error) => {
  console.log(error);
});
