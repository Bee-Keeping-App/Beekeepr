# Guide to reading this backend

### Jacob Hebbel
### written on thanksgiving 2025


Hello developer! I have written this in case you are not familiar with this backend structure. As someone who used to think backend development involved dumping everything into a file called server.js, I can understand how it will seem confusing. Or if you are just someone trapezing back here for some odd reason, this will help you navigate the structure.

## 1. Abstracting backend logic as layers

When working with networks, microservices, validation, databases, and general async shenanigans, it gets complicated on backend. Thats why its useful to abstract your code into layers, where each layer implements something in isolation. This will make your code modular to future changes (ie adding routes) and integrations (ie new service).

Here is the general structure of your layers, from top-level to deepest:

### 1. API layer
Other programmers will interact with this backend at this layer, aka frontend 'devs' What they do is still unknown, but it is certain that they will need to access certain resources. define these resources with named routes for them to use
Things done at this layer: routes are declared, middlewares called and used. 


### 2. Routing layer
/routes holds various endpoints for your application. Remember each route refers to an HTTP-defined resource, implementing methods for interacting with that resource (GET, POST, DELETE, etc). each file in /routes correlates to a different resouce. Inside a file, the methods are implemented for that resource as endpoints, and deeper-layer logic is imported and called


### 3. Validation layer
/validation is also resource-organized like /routes, but instead uses the **Joi** library for validating requests. This library checks that input is the correct data type, length, matches a regex pattern, etc. In a file, multiple validation functions can be implemented, and each may be used for a different method endpoint implemented in the resource's routes. This logic is called as a middleware function inside an endpoint's function call before executing any business logic.


### 4. HTTP layer
/controllers is pretty simple. It acts as a wrapper for the business logic (a deeper layer) but plays an important role by handling all the HTTP response logic. This allows the business layer to not worry about handling that, and keeps things nice and organized.


### 5. Business (logic) layer
/services is where we implement the logic. Interacting with mongo, maybe a future redis implementation, would happen here


### 6. Data layer
/models is where the mongo schema lives. This ensures info in every collection has the same values