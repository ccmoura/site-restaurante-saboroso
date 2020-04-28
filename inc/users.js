const conn = require('./db')
module.exports = {
    render(req, res, error){
        res.render("admin/login", {
            body: req.body,
            error
        })
    },
    login(email, password){
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_users WHERE email=?`, [email], (err, results) => {
                
                if(err){
                    reject(err);
                } else{
                    if(results.length <= 0){
                        console.log(results)
                        reject("Usuário ou senha incorretos")
                    } else{
                        let row = results[0];
                        if(row.password !== password){
                            reject("Usuário ou senha incorretos")
                        } else{
                            resolve(row);
                        }
                    }
                }
            })
        });
    },

    getUsers() {
        return new Promise((resolve, reject) => {
          conn.query(`select * from tb_users order by name`, (err, results) => {
            if (err) {
              reject(err);
            }
            resolve(results);
          });
        });
      },
      delete(id){
        return new Promise((resolve, reject) => {
          conn.query(`delete from tb_users where id = ?`, [id], (err, result) => {
            if(err){
              reject(err);
            } else{
              resolve(result);
            }
          })
        })
      },
      save(fields, files){
        return new Promise((resolve, reject) => {
          let query, queryPhoto = '', params = [
            fields.name,
            fields.email,
          ];
          if(parseInt(fields.id) > 0){
            params.push(fields.id);
            query = `
            update tb_users
            set name = ?, email = ?
            where id = ?`;
          } else {
            query = `
            insert into tb_users
            (name, email, password) 
            values(?, ?, ?)`;

            params.push(fields.password)
          }
          conn.query(query, params, (err, results) => {
            if(err){
              reject(err);
            } else{
              resolve(results);
            }
          })
        })
      }
}