var express = require('express');
var axios = require('axios')
var responseTime = require('response-time')
const Redis = require('redis')
var app = express();
const redisClient =  Redis.createClient();
redisClient.connectTimeout = 1000


app.use(responseTime())

app.get('/todos' , async (req,res) => {

    let result = await getorsetRedis('todos' , async () => {
        let {data} = await axios.get('https://jsonplaceholder.typicode.com/todos')
        return data;
    }) 

    res.json(result)
})

function getorsetRedis(key,cb)
{
 
    return new Promise((resolve,reject) => {
        redisClient.get(key , async (error , todos) => {
            if(error) return reject(error)
            if(todos != null)
            {
                return resolve(JSON.parse(todos))
            }
               let data = await cb();
               redisClient.setex(key ,3600, JSON.stringify(data))
               resolve(data)
            
            
        }) 
    })
        
    
}

app.listen(3000 , () => {
    console.log('Server is running on port : 3000')
})