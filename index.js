const express=require('express');
const app=express();

//DATABASE CONNECTION
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalInventory';
let db

//BODYPARSER
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//CONNECTING SERVER FILES FOR AWT
let server=require('./server');
let middleware=require('./middleware');
const response=require('express');

MongoClient.connect(url,{useUnifiedToology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database:${url}`);
    console.log(`Database:${dbName}`);
});

//FETCHING HOSPITAL DETAILS 
app.get("/getHospital",middleware.checkToken,function(req,res){     
    console.log("Fetching data from hospital collection");
    var data = db.collection('hospital').find().toArray()
         .then(result => res.send(result));
});

//FETCHING VENTILATORS DETAILS 
app.get("/getVentilator",middleware.checkToken,function(req,res){
    console.log("Fetching data from ventilators collection");
    var data = db.collection('ventilator').find().toArray()
         .then(result => res.send(result));
});

//SEARCH VENTILATORS BY Status
app.post('/searchVentilatorByStatus',middleware.checkToken,(req,res)=>{
    var Status=req.body.Status;
    console.log(Status);
    var ventilatordetails=db.collection('ventilator').find({"Status":Status}).toArray()
        .then(result=>res.json(result));
});

//SEARCH VENTILATORS BY HospitalName
app.post('/searchVentilatorByName',middleware.checkToken,(req,res)=>{
    var Name=req.query.Name;
    console.log(Name);
    var ventilatordetails=db.collection('ventilator')
    .find({'Name':Name}).toArray().then(result=>res.json(result));
});

//SEARCH HOSPITAL BY Name
app.post('/searchHospitalByName',middleware.checkToken,(req,res)=>{
    var Name=req.query.Name;
    console.log(Name);
    var hospitaldetails=db.collection('hospital')
    .find({'Name':Name}).toArray().then(result=>res.json(result));
});

//UPDATE VENTILATOR DETAILS 
app.put('/updateVentilator',middleware.checkToken,(req,res)=>{
    var ventid={VentilatorId:req.body.VentilatorId};
    console.log(ventid);
    var newvalues={$set:{Status:req.body.Status}};
    db.collection("ventilator").update(ventid,newvalues,function(err,result){
        res.json('1 document updated');
        if(err)throw err;
    });
});

//ADD VENTILATOR
app.post('/addVentilatorByUser',middleware.checkToken,(req,res)=>{
    var hId=req.body.hId;
    var VentilatorId=req.body.VentilatorId;
    var Status=req.body.Status;
    var Name=req.body.Name;
    var item=
    {
        hId:hId,VentilatorId:VentilatorId,Status:Status,Name:Name
    };
    db.collection('ventilator').insertOne(item,function(err,result){
        res.json('Item inserted');
    });
});

//DELETE VENTILATOR BY VentilatorId
app.delete('/deleteVentilator',middleware.checkToken,(req,res)=>{
    var myquery=req.query.VentilatorId;
    console.log(myquery);

    var myquery1={VentilatorId:myquery};
    db.collection('ventilator').deleteOne(myquery1,function(err,obj)
    {
        if(err)throw err;
        res.json("1 document deleted");
    });

});
app.listen(3000);