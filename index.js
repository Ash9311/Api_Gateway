const express = require('express');
const app = express();
const morgan = require('morgan');
const {createProxyMiddleware} = require('http-proxy-middleware');
const PORT = 3005;
const rateLimit = require('express-rate-limit')
const axios = express();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})
app.use(morgan('combined'));
app.use(limiter)
app.use('/bookingservice', async (req,res,next)=>{
console.log(req.headers['x-access-token']);
try {
    const response = await axios.get('http://localhost:3001/api/v1/isauthenticated',{
    headers: {
        'x-access-token': req.headers['x-access-token']
    }
});
console.log(response.data);
if(response.data.success){
    next();
}
else{
    return res.status(401).json({
        message: 'unauthorized'
    })
}
} catch (error) {
    return res.status(401).json({
        message: 'unauthorized'
    })
}

    // console.log("Hi");
    // if(response.data.success){
    //     next();
    // }
    // else{
    //     return res.status(401).json({
    //         message: 'Unauthorised'
    //     })
    // }
})
app.use('/bookingservice',createProxyMiddleware({
    target: 'http://localhost:3002/', changeOrigin: true
}));
app.get('/home', (req,res) => {
    return res.json({
        message: 'OK'
    });
})

app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`);
})