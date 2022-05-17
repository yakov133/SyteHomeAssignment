const express = require('express');
const router = express.Router();
router.use(express.json())

const {
    Creat,
    Read,
    Update,
    Delete,
    search } = require("../utilies.js")



router.get("/", (req, res) => {
    res.send("Welcome to the data center of ");
  });
  
router.get("/search", (req, res) => { //search
    search(req,res);
});

router.post("/person",(req,res)=>{ //creat
    Creat(req,res);
})
  
router.get("/person", (req, res) => { //get
      Read(req,res);
});

router.patch("/person",(req,res)=>{ //update
    Update(req,res);
})

router.delete("/person",(req,res)=>{ //delete
    Delete(req,res);
})

  
router.get("*", (req, res) => {
    res.send(`Error please check your URL, Can't get ${req.url}`);
});


module.exports = router;