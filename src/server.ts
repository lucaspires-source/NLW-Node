import express from 'express';

const app = express();
app.get("/",(request,response)=>{
    return response.json({message:"Hello World do Lucas"})
})

app.post("/",(request,response)=>{
    return response.json({message:"Hello World do Lucas de novo"})
})
app.listen(3333,() => console.log('Server is running on http://localhost:3333'))