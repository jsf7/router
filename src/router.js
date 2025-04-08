export class Router {
    constructor(options = {}) {
      options.base = options.base || location.origin;
      this.base = options.base;
      this.prevPath = null;
      this._events = {};
      this.evtTimer = null;

      if(!globalThis._$$routers) {
        globalThis._$$routers = [];
      }
        
      this.init();
    }
  
    on(e, f) {
      this._events[e] ? this._events[e].push(f) : (this._events[e] = [f]);
      clearTimeout(this.evtTimer);
      this.evtTimer = setTimeout(() => {
        this.eventManager();
      }, 50);
  
      return this;
    }
  
    dispatch(e, f) {
      const eharr = e.split('/').filter(itm => !!itm);
      let found = false;
  
      for (const i in this._events) {
        const itm = this._events[i];
        if (i === e) {
          itm.forEach(c => {
            if (c) c.call(this, f);
          });
          found = true;
          break;
        } else if (i.includes(':')) {
          const patharr = i.split('/').filter(itm => !!itm);
          if (eharr.length === patharr.length) {
            let is = true;
            let p = 0;
            const l = patharr.length;
            while (p < l) {
              if (patharr[p] !== eharr[p] && !patharr[p].includes(':')) {
                is = false;
                break;
              }
              p++;
            }
            if (is) {
              itm.forEach(c => {
                if (c) c.call(this, f);
              });
              found = true;
            }
          }
        }
      }
  
      if (!found) {
        this.notFound();
      }
    }
  
    notFound() {
      if (this._events['/404']) {
        this.setPath('/404');
      }
    }
  
    setPath(path, force) {
      path = path.trim();
      history.pushState(null, null, (this.base + path).replace(/([^:]\/)\/+/g, "$1"));
      this.eventManager();
    }
  
    getPath() {
      return (location.href.split(this.base)[1] || '').split('?')[0].trim();
    }
  
    getPathParams() {
      const path = this.getPath();
      const arr = path.split('/').filter(n => !!n.trim());
      const obj = {};
      arr.forEach((item, index) => {
        if (index % 2 === 0 && arr[index + 1]) {
          obj[item.trim()] = arr[index + 1].trim();
        }
      });
      return obj;
    }
  
    eventManager() {
      clearTimeout(this.emTime);
      this.emTime = setTimeout(() => {
        const path = this.getPath();
        if (this.prevPath !== path) {
          this.prevPath = path;
          this.dispatch(('/' + path).replace(/\/\//g, "/"), this.getPathParams());
          this.dispatch('$change', ('/' + path).replace(/\/\//g, "/"), this.getPathParams());
        }
      }, 1);
    }
  
    init() {
      window.addEventListener("popstate", () => {
        this.eventManager();
      });
      globalThis._$$routers.push(this);
    }
  }
  