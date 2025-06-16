
const NODE_ENV = process.env.NODE_ENV ;


const Env = {
    
    MONGO_URL: process.env.MONGO_URI || "",
    NODE_ENV: NODE_ENV,
    JWT_SECRET :process.env.JWT_SECRET 
   
    
};



export default Env;
