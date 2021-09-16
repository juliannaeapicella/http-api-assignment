const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const respondJSON = (request, response, status, object) => {
  respond(request, response, status, JSON.stringify(object), 'application/json');
};

const respondXML = (request, response, status, object) => {
  let responseXML = '<response>';
  if (object.id) {
    responseXML = `${responseXML} <id>${object.id}</id>`;
  }
  responseXML = `${responseXML} <message>${object.message}</message>`;
  responseXML = `${responseXML} </response>`;

  return respond(request, response, status, responseXML, 'text/xml');
};

const getIndex = (request, response) => {
  respond(request, response, 200, index, 'text/html');
};

const getCSS = (request, response) => {
  respond(request, response, 200, css, 'text/css');
};

const success = (request, response, acceptedTypes) => {
  const obj = {
    message: 'This is a successful response.',
  };

  return acceptedTypes[0] === 'text/xml'
    ? respondXML(request, response, 200, obj)
    : respondJSON(request, response, 200, obj);
};

const badRequest = (request, response, acceptedTypes, params) => {
  const obj = {
    id: 'badRequest',
    message: 'This request has the required parameters.',
  };

  if (!params.valid || params.valid !== 'true') {
    obj.message = 'Missing valid query parameter set to true.';
    obj.id = 'badRequest';

    return acceptedTypes[0] === 'text/xml'
      ? respondXML(request, response, 400, obj)
      : respondJSON(request, response, 400, obj);
  }

  return acceptedTypes[0] === 'text/xml'
    ? respondXML(request, response, 200, obj)
    : respondJSON(request, response, 200, obj);
};

const unauthorized = (request, response, acceptedTypes, params) => {
  const obj = {
    id: 'unauthorized',
    message: 'You do not have access to this content.',
  };

  if (!params.loggedIn || params.loggedIn !== 'true') {
    obj.message = 'Missing loggedIn query parameter set to true.';
    obj.id = 'unauthorized';

    return acceptedTypes[0] === 'text/xml'
      ? respondXML(request, response, 401, obj)
      : respondJSON(request, response, 401, obj);
  }

  return acceptedTypes[0] === 'text/xml'
    ? respondXML(request, response, 200, obj)
    : respondJSON(request, response, 200, obj);
};

const forbidden = (request, response, acceptedTypes) => {
  const obj = {
    id: 'forbidden',
    message: 'You do not have access to this content.',
  };

  return acceptedTypes[0] === 'text/xml'
    ? respondXML(request, response, 403, obj)
    : respondJSON(request, response, 403, obj);
};

const internal = (request, response, acceptedTypes) => {
  const obj = {
    id: 'internalError',
    message: 'Internal Server Error. Something went wrong.',
  };

  return acceptedTypes[0] === 'text/xml'
    ? respondXML(request, response, 500, obj)
    : respondJSON(request, response, 500, obj);
};

const notImplemented = (request, response, acceptedTypes) => {
  const obj = {
    id: 'notImplemented',
    message: 'A GET request for this page has not been implemented yet. Check again later for updated content.',
  };

  return acceptedTypes[0] === 'text/xml'
    ? respondXML(request, response, 501, obj)
    : respondJSON(request, response, 501, obj);
};

const notFound = (request, response, acceptedTypes) => {
  const obj = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };

  return acceptedTypes[0] === 'text/xml'
    ? respondXML(request, response, 404, obj)
    : respondJSON(request, response, 404, obj);
};

module.exports = {
  getIndex,
  getCSS,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
