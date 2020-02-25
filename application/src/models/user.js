/*
Description: User Model and specific functions relating to the user such as user registration and validation
*/

const bcrypt = require('bcryptjs');
const db = require('./database.js');
const saltRounds = 10;
class User {
    static async register(username, email, pass){
        const hash = bcrypt.hashSync(pass, saltRounds);
        // console.log(username);
        return db.query('Insert Into db.users (username, email, password) VALUES (?, ?, ?) ',
            [username, email, hash])
            .then((results) => {
                return results[0].insertId;
            });
    }

    static async checkValid(email){
        return db.query('SELECT * from db.users where email = ?', email)
            .then(([rows, fields]) => {
                if(!email) return false;
                if(!rows || rows == null || rows.length === 0){
                    console.log("user class: "+rows);
                    return true;
                }
                return false;
            });
    }

    static async findUser(name, pass) {
        return db.query('SELECT * FROM db.users WHERE email = ?', name)
            .then(([rows, fields]) => {
                if (!rows || rows == null || rows.length !== 1) {
                    return false;
                }
                if(bcrypt.compareSync(pass, rows[0].password)){
                    console.log("return rows[0]"+rows[0]);
                    return rows[0];
                }else{
                    return false;
                }
            });
    }


}



module.exports.User = User;