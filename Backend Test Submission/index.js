import express from 'express'
import { Delete } from 'lucide-react';
const app  = express()
app.use(express.json())
const urls = {};

function generateCode(){
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    const length  = Math.floor(Math.random()*2)+5;
    for(let i =0;i<length;i++){
        code+=chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code;
}

app.post('/shorturls', (req, res)=>{
    let {givenUrl , duration, shortCode} = req.body;
    if(!givenUrl || !duration){
        return res.status(400).json({error : "Given url or duration"})
    }
    do{
        shortCode = generateCode();
    }while(urls[shortCode]);
    const expire = Date.now() + duration*1000;
    urls[shortCode] = {givenUrl , expire};
    res.json ({shortLink : `http://${req.get("host")}/${shortCode}`, expiry : `${expire}`});
});

app.get("/shorturls/:shortCode", (req, res)=>{
    const {shortCode} = req.params;
    const entry = urls[shortCode];
    if(!entry) {
        return res.status(404).send("URL not found");
    }
    if(Date.now()>entry.expire){
        delete urls[shortCode];
        return res.status(410).send("Short Url Expired");
    }
    res.redirect(entry.givenUrl);
})

const PORT = 8724;
app.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})