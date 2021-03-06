var conn = require('./db')
module.exports = {
    render(req, res, error, success){
        res.render("reservations", {
            title: "Reservas - Restaurante Saboroso!",
            background: "images/img_bg_2.jpg",
            h1: "Reserve uma Mesa!",
            body: req.body,
            error,
            success
          });
    },
    getReservations() {
        return new Promise((resolve, reject) => {
          conn.query(`select * from tb_reservations order by date desc`, (err, results) => {
            if (err) {
              reject(err);
            }
            resolve(results);
          });
        });
    },
    delete(){
        return new Promise((resolve, reject) => {
            conn.query(`delete from tb_reservations where id = ?`, [id], (err, result) => {
              if(err){
                reject(err);
              } else{
                resolve(result);
              }
            })
        })
    },
    save(fields){
        return new Promise((resolve, reject) => {
            if(fields.date.indexOf('/') > -1){
                let date = fields.date.split('/');
                fields.date = `${date[2]}-${date[1]}-${date[0]}`;
            }
            let query, params = [
                fields.name, fields.email, fields.people, fields.date, fields.time
            ];
            if(parseInt(fields.id) > 0){
                query = `update tb_reservations set name = ?, email = ?, people = ?, date = ?, time = ? where id = ?`;
                params.push(fields.id);
            } else{

                query = `insert into tb_reservations (name, email, people, date, time) values(?, ?, ?, ?, ?)`;
            }

        conn.query(query, params,
         (err, results) => {
            if(err){
                reject(err);
            } else{
                resolve(results);
            }
         })
        })
    }
}