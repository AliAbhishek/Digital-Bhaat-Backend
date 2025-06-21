
const NODE_ENV = process.env.NODE_ENV ;


const Env = {
    
    MONGO_URL: process.env.MONGO_URI || "",
    NODE_ENV: NODE_ENV,
    JWT_SECRET :process.env.JWT_SECRET,
    MONGO_ENC_KEY:process.env.MONGO_ENC_KEY,
    MONGO_SIG_KEY:process.env.MONGO_SIG_KEY,
    S3_BUCKET_NAME:process.env.S3_BUCKET_NAME
   
    
};



export default Env;
