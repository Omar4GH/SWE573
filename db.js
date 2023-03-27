import mysql from "mysql";

export const db = mysql.createConnection({
host:"localhost",
port: 6400,
database:"livingstories",
user:"root",
password:"password",


})