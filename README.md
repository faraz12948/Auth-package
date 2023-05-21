## Auth package

- Built upon express.js
- Uses JWT for authentication.
- Its a besic architechture of how a auth package can be built upon express.
- User can install and use this auth package on their project.
- Provideds login,signup routes for authentication.
- Provides two middleware for secure route.

# How to use

- npm install auth-package-t1
- import the package
```
const express = require('express');
const app = express();
const Auth = require('auth-package-t1');
const pool = require('./config/dbConfig');
const router = express.Router();
app.use(router);


app.listen(5000, () => {
    console.log(`Example app listening on port ${5000}`)
})

```
- Call the auth provided function from the package.
```
const auth = Auth(your_db_pool, your_secret_key, email_for_using_forgot_password, app_password_of_provided_email);

```
- Use the provided route from the package
```
app.use(auth.authApp);


```
- Use provided middleware
```
router.route('/auth-t1/protected/test').get([auth.AuthMiddleware.authorizedUser, auth.AuthMiddleware.authorizedUserdb], async (req, res) => {
    res.status(200).json({
        "data": "secret"
    })
})
```
