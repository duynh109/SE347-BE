import JWT from 'jsonwebtoken';

export default async function Auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await JWT.verify(token, ENV.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export function localVariables(req, res, next) {
  req.app.locals = { OTP: null, resetSession: false };
  next();
}
