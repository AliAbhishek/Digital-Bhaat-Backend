
import ServerlessHttp from 'serverless-http';
import app from './index';


export const handler = ServerlessHttp(app, {
  request: (req: any) => {
    if (Buffer.isBuffer(req.body) && req.body.length > 0) {
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        try {
          req.body = JSON.parse(req.body.toString());
        } catch (err) {
          console.warn("❌ Failed to parse buffer to JSON:", err);
          req.body = {}; // fallback to avoid crash
        }
      } else {
        req.body = {}; // Non-JSON body (e.g., multipart/form-data)
      }
    }
  },
});


