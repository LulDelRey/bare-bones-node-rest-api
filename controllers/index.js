const ping = (_, callBack) => {
  callBack(200, { ok: true, message: 'Pong' });
};

const notFound = (data, callBack) => {
  callBack(404, { ok: false, message: 'Not found!', payload: data });
};

module.exports = {
  ping,
  notFound,
};
