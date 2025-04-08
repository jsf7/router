import { Router } from '../src/router.js';  

describe('Router Class', () => {
  let router;
  let mockCallback;

  beforeEach(() => {
    // Set up a new instance of the Router before each test
    router = new Router({ base: '/base' });
    mockCallback = jest.fn();
  });

  test('should initialize with default base', () => {
    const defaultRouter = new Router({});
    expect(defaultRouter.base).toBe(location.origin);
  });

  test('should initialize with given base', () => {
    const customBase = 'http://localhost:3000';
    const customRouter = new Router({ base: customBase });
    expect(customRouter.base).toBe(customBase);
  });

  test('should register event handler using "on()"', () => {
    router.on('/home', mockCallback);

    // Simulate dispatching the event
    router.dispatch('/home');
    
    expect(mockCallback).toHaveBeenCalled();
  });

  test('should handle wildcard route with dynamic segments', () => {
    router.on('/user/:id', mockCallback);

    // Simulate dispatching with dynamic segment
    router.dispatch('/user/123');
    
    expect(mockCallback).toHaveBeenCalled();
    expect(mockCallback.mock.calls[0][0]).toEqual({ id: '123' });
  });

  test('should not call handler for non-matching route', () => {
    router.on('/home', mockCallback);
    router.dispatch('/about');
    
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('should redirect to /404 if not found', () => {
    const mockGoto = jest.spyOn(router, 'goto');
    router.on('/404', mockCallback);
    
    router.dispatch('/nonexistent');
    expect(mockGoto).toHaveBeenCalledWith('/404');
  });

  test('should update path using "goto()"', () => {
    // Spy on the history.pushState to check if it was called
    const pushStateSpy = jest.spyOn(history, 'pushState');
    
    router.goto('/new-path');
    
    expect(pushStateSpy).toHaveBeenCalledWith(null, null, '/base/new-path');
  });

  test('should get current path using "getPath()"', () => {
    // Simulate the URL change
    window.history.pushState({}, '', '/base/test-path');
    
    expect(router.getPath()).toBe('test-path');
  });

  test('should extract path parameters using "getPathParams()"', () => {
    window.history.pushState({}, '', '/base/user/123/details');
    
    expect(router.getPathParams()).toEqual({ user: '123', details: 'details' });
  });

  test('should call eventManager on popstate', () => {
    const eventManagerSpy = jest.spyOn(router, 'eventManager');
    
    // Simulate popstate event
    window.dispatchEvent(new PopStateEvent('popstate'));
    
    expect(eventManagerSpy).toHaveBeenCalled();
  });
});

