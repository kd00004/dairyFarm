import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  //it accepts user information
  return jwt.sign(
    //jwt is an object
    //first parameter is user , second is jwt secret which is a secret string to encrypt the data
    //and last options
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next(); //by calling next we go to orderRoutes to orderRouter.post() function
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); //go to next middleware function
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
