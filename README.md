# router.js
Zero dependency JavaScript router


## Installation

Include it in your project

   ```js
   import { Router } from "router.js" 
   ```

## Usage

   ```js

    const router = new Router();

    router.on('/test', () => {
        console.log('test');
    });

    router.on('/user/:id/profile', (params) => {
        console.log(params);
    });

    router.on('$change', (path) => {
        console.log(path);
    });



   ```

 

## Methods

   ```ts
   router.goto(url: String)

   router.getPath(): String

   router.setPath(url: String)

   router.getPathParams(): Object
 

   ```

## License

[MIT](LICENSE) © [jsf7](https://github.com/jsf7).
