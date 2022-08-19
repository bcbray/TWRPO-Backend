import { RequestHandler } from 'express';

const requireHttps: RequestHandler = (req, res, next) => {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== 'development' && req.hostname !== 'localhost') {
    return res.redirect(`https://${req.get('host')}${req.url}`, 301);
  }
  next();
};

export default requireHttps;
