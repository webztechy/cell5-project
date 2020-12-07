import dotenv from 'dotenv';
import mysql from 'mysql';


class ConnectionModel {
  
  private connection : any;

  get connectdb() {
    return this.connection;
  }
  constructor() {
    dotenv.config();

    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: true // for multiple sql execution
    });

    this.connection.connect(function(err : any) {
      if (!err) {
        console.log("Database is connected ... \n\n");
      } else {
        console.log("Error connecting database ... \n\n");
      }
    });

  }
}

export = new ConnectionModel().connectdb;


