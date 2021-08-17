const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../.data/');

const create = (dir, fileName, data, callback) => {
  fs.open(`${baseDir}${dir}/${fileName}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Could not close new file!');
            }
          });
        } else {
          callback('Could not write to file!');
        }
      });
    } else {
      callback('Could not create new file, it may already exist!');
    }
  });
};

const read = (dir, fileName, callback) => {
  fs.readFile(`${baseDir}${dir}/${fileName}.json`, 'utf8', (err, data) => {
    callback(err, data);
  });
};

const update = (dir, fileName, data, callback) => {
  fs.readFile(`${baseDir}${dir}/${fileName}.json`, 'r+', (err, fileDescriptor) => {
    if(!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.truncate(fileDescriptor, (err) => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback('Could not close new file!');
                }
              });
            } else {
              callback('Could not update the file!');
            }
          });
        } else {
          callback('Could not update the file!');
        }
      });
    } else {
      callback('Could not open the file to update!');
    }
  });
};

const destroy = (dir, fileName, callback) => {
  fs.unlink(`${baseDir}${dir}/${fileName}.json`, 'utf8', (err, data) => {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting file1');
    }
  });
};

module.exports = {
  create,
  read,
  update,
  destroy,
};
