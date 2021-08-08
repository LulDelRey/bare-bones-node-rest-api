const sample = (data, callBack) => {
  callBack(200, { ok: true, message: 'Sample handler!', payload: data });
};

const notFound = (data, callBack) => {
  callBack(404, { ok: false, message: 'Not found!', payload: data });
};

module.exports = {
  sample,
  notFound,
};
