# helP-Plz 
A full-stack application that serves as a platform for users to ask and answer questions. 

**Link to project:** Coming Soon

![Screenshot of website](https://gyazo.com/4801baea26a82dfa145b9687743607c0)

## How It's Made: 

**Tech used:** Javascript, MongoDB, Express.js, EJS, Node.js, Passport.js, Bootstrap, Cloudinary

This application was built using the MVC (model - view - controller) structure. MongoDB served as the model (database) and Mongoose was used to structure the object data. Embedded Javascript (EJS) was used for the view (client). Express and Node performed the functional programming that bridged communication between client and database. Passport was used for authentication purposes, Bootstrap for a more palatable user interface, and Cloudinary for image storage. 

## Lesson Learned:

Templating engines like EJS can be used to dynamically add information from a database to static template files, which are then rendered as HTML files to the client. There are many different templating engines, but EJS was picked for the ease at which HTML markup was generated with plain Javascript. Off-the-shelf middleware like Passport for authentication, and CSS framework like Bootstrap, can come in handy when piecing together different aspects of an application. 

## Optimizations:

If the application were to be on a grander scale and required complex routing and heavy data-driven components, then React would be better than EJS for the view portion of MVC. Other optimizations include utilizing other strategies (Google, Twitter, Facebook, etc.) for login using Passport. Email verification can also be added to prevent users from creating accounts with fake email addresses; users would have to click on a verification link sent to the email address they've provided before accessing the application.