
import ServerlessHttp from 'serverless-http';
import app from './index';


export const handler = ServerlessHttp(app, {
  request: (req: any) => {
    if (Buffer.isBuffer(req.body) && req.body.length > 0) {
      try {
        req.body = JSON.parse(req.body.toString());
      } catch (err) {
        console.warn("❌ Failed to parse buffer to JSON:", err);
      }
    } else {
      req.body = {}; // fallback to prevent undefined errors
    }
  }
});

