import { Router } from "./router.js";

export const setPath = function (url, _triggerEvent, router) {
  if(typeof _triggerEvent === undefined) {
      _triggerEvent = true;
  }
  if(typeof router === 'undefined') {
      router = (function () {
          if(!globalThis._$$routers) {
            globalThis._$$routers = [];
          }
          if (!globalThis._$$routers[0]) {
              globalThis._$$routers[0] = new Router(defaultRouterConfig)
          }
          return globalThis._$$routers[0]
      })();
  }
  router.setPath(url);
  if(_triggerEvent) {
      globalThis._$$routers.forEach(function (router) {
          router.eventManager();
      });
  }
}