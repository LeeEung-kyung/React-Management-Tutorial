const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//Database 가져오기
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

//Database 연결
const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
}); //객체 초기화
connection.connect(); //수행

//서버 파일처리 upload폴더에 저장
const multer = require('multer');
const upload = multer({dest: './upload'});

//get
app.get('/api/customers', (req,res) => {
    connection.query(
        "SELECT * FROM CUSTOMER WHERE isDeleted = 0",
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

//upload파일을 공유 사용자는 image경로로 사용
app.use('/image', express.static('./upload'));

//post
app.post('/api/customers', upload.single('image'), (req, res) =>{
    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ? ,?, now(), 0)';
    //multer가 자동으로 파일이름랜덤으로 생성 저장
    let image = '/image/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;
    let params = [image, name, birthday, gender, job];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

//삭제
app.delete('/api/customers/:id', (req, res) => {
    let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?';
    let params = [req.params.id];
    connection.query(sql, params,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));