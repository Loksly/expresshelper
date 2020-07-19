
## Express Helper

Express helper is a plugin that saves logic when writing applications using [express](https://expressjs.com/).

### Installation

```
npm i @loksly/expresshelper
``` 

### Usage

```typescript
import { expresshelper, ResponseHelper } from "@loksly/expresshelper";

/* ... */

app.use(expresshelper());

/* or you may customize
app.use(expresshelper({
    logger: console,
    enableJSONP: false;
    shouldSend404onEmpty: true;
}));
*/

app.get("/api/v1/pizzas/:id", (req, res: ResponseHelper) => {
    if (typeof req.params.id === "string") {
        res.locals.expresshelper.promiseWrapper(pizzas.findOne(id));
    } else {
        res.locals.expresshelper.promiseWrapper(pizzas.find(id));
    }
});

app.put("/api/v1/pizzas/:id", (req, res) => {
    if (typeof req.params.id === "string") {
        res.locals.expresshelper.promiseWrapper(pizzas.findOne(id));
    } else {
        res.locals.expresshelper.missing
    }
});

app.listen(3000, "localhost", () => console.log("Listening on http://localhost:3000"));

```

Now you can the expected output for your application is:

```
curl http://localhost:3000/pizzas # outputs the whole list of pizzas
curl http://localhost:3000/pizzas/nonexistingId # outputs 404 status code (not found error)
curl http://localhost:3000/pizzas/existingId # outputs a single pizza element
```

### API

- `callbackErrorHelper(err: any): void`
- `cb(err: any, value: any): void`
- `cbWithDefaultValue(defaultValue: any): (err: any) => void`
- `errorHelper(errCode?: number | string, defaultMessage?: undefined | string): (err: any) => void`
- `forbiddenHelper(details: any): void`
- `missingParameterHelper(parametername: string): void`
- `notFoundHelper(): void`
- `notImplementedHelper(): void`
- `okHelper(shouldSend404onEmpty?: undefined | false | true): (data: any) => void`
- `okHelperWithDefaultValue(defaultvalue: any, statusCode?: undefined | number): (data: any) => void`
- `promiseWrapper(promise: Promise<any>, shouldSend404onEmpty?: undefined | false | true): void`
- `send(content: any, statusCode?: undefined | number): void`
- `unauthenticatedHelper(details: any): void`
- `unauthorizedHelper(details: any): void`