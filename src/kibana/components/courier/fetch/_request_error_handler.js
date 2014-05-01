define(function (require) {
  return function RequestErrorHandlerFactory(Private, Notifier) {
    var pendingRequests = Private(require('../_pending_requests'));
    var errorHandlers = Private(require('../_error_handlers'));

    var notify = new Notifier({
      location: 'Courier Fetch Error'
    });

    function RequestErrorHandler() {}

    RequestErrorHandler.prototype.handle = function (req, error) {
      pendingRequests.push(req);

      var handlerCount = 0;
      errorHandlers.splice(0).forEach(function (handler) {
        if (handler.source !== req.source) return pendingRequests.push(handler);
        handler.defer.resolve(error);
        handlerCount++;
      });

      if (!handlerCount) {
        notify.fatal(new Error('unhandled error ' + (error.stack || error.message)));
      }
    };

    return RequestErrorHandler;
  };
});