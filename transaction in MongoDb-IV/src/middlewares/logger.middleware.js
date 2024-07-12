import fs from 'fs';

const fsPromise = fs.promises;

async function log(logData) {
  try {
    logData = `\n ${new Date().toString()} - ${logData}`;
    // await fsPromise.appendFile(
    //   'log.txt',
    //   logData
    // );
    console.log(logData);
  } catch (err) {
    console.log(err);
  }
}

const loggerMiddleware = async (
  req,
  res,
  next
) => {
  // 1. Log request body.
  if (!req.url.includes('signin')) {
    const logData = `${
      req.url
    } - ${JSON.stringify(req.body)}`;
    await log(logData);
  }
  next();
};

export default loggerMiddleware;
