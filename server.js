const express = require('express');
const mysql = require('mysql')
require('dotenv').config();
const app = express()
const cors = require("cors")

const db = mysql.createConnection({
    host: "sql11.freemysqlhosting.net",
    user: "sql11465847",
    password: process.env.PASSWORD,
    database: "sql11465847"
})

db.connect()

//middleware
app.use(cors());
app.use(express.json())

// TODO: HOST also the server 


//get all blogs
app.get("/blogs", (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const sql = `
    SELECT 
    id,
    title, 
    body, 
    DATE_FORMAT(posted_date, '%d/%m/%Y %H:%i') AS posted_date
    FROM blogs;`
    db.query(sql, (err, result)=>{
        if(err) throw err;
        res.send(result)
    })
});

//get one blog
app.get("/blogs/:id", (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const sql = `
    SELECT
    blogs.id,
    blogs.title, 
    blogs.body, 
    DATE_FORMAT(blogs.posted_date, '%d/%m/%Y %H:%i') AS posted_date,
    comments.id AS comment_id,
    comments.body AS comment_body,
    DATE_FORMAT(comments.posted_date, '%d/%m/%Y %H:%i') AS comment_date
    FROM blogs
    LEFT JOIN comments ON blogs.id = comments.blog_id
    WHERE blogs.id = ?;`
    db.query(sql,[req.params.id], (err, result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//add a comment
app.post("/blogs/:id", (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const post = req.body
    const sql = `
    INSERT INTO comments(blog_id, body) VALUES(?, ?) ;
    `
    db.query(sql,[req.params.id, post.body], (err, result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//add a blog post
app.post("/blogs/", (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const post = req.body
    const sql = `
    INSERT INTO blogs(title, body, genre) VALUES(?, ?, ?) ;
    `
    db.query(sql,[post.title, post.body, post.genre], (err, result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//projekty
app.get("/projects", (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const sql = `
    SELECT 
    id,
    project_name,
    body, 
    link,
    DATE_FORMAT(posted_date, '%d/%m/%Y %H:%i') AS posted_date
    FROM projects;`
    db.query(sql, (err, result)=>{
        if(err) throw err;
        res.send(result)
    })
});

//get one project
app.get("/projects/:id", (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const sql = `
    SELECT
    id,
    project_name,
    body,
    link,
    DATE_FORMAT(posted_date, '%d/%m/%Y %H:%i') AS posted_date
    FROM projects
    WHERE id = ?;`
    db.query(sql,[req.params.id], (err, result)=>{
        if(err) throw err;
        res.send(result)
    })
})



const port = process.env.PORT
app.listen(port , ()=>{
    console.log(`listening on port ${port}`);
    
})