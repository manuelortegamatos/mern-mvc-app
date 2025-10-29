//handles 404 (not Found ) errors

const notFound= (req,res, next) =>{

  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // passes the error to the global error handler

}

// Global Error Handler 
const errorHandler = (err, req, res, next) => {
  //sometimes the status code is 200 even for an error, so we chage it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
     message: err.message,
     // only include the stack trace in development mode for debugging 
     stack: process.env.NODE_ENV === 'production' ? null : err.stack,
     
  });
};

export {notFound, errorHandler};