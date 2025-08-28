1. MongoDB Atlas (website)
Log in → Clusters → Click Connect → Choose Connect with MongoDB Compass or Connect your application.
It will give you the same kind of link (with your username & password).

2. MongoDB Compass (app on laptop)
Open Compass → Click New Connection
Paste your link → Click Connect
It will show all your databases inside that cluster.
👉 So the link is the key. You can use it in:

3. Atlas (to check/monitor DB online)
Compass (GUI tool on laptop)
VS Code project (with mongoose)

## In MongoDB Atlas:

Log in → Go to your Cluster
Click Connect button
Choose Connect your application
Copy the connection string again
👉 You can regenerate it anytime.

## notes:
1. MongoDB Atlas – one-time setup (cloud DB, no need to run locally).
2. Mongoose – install in every new project (npm i mongoose).
3. Other auth packages – bcryptjs, jsonwebtoken, cors, dotenv, cookie-parser, nodemailer.
4. Nodemon – install locally (npm i --save-dev nodemon) and add "dev": "nodemon server.js" in scripts.
5. .env file – store your Atlas connection string (remove last / if adding DB name in code).
6. Compass – paste full Atlas string (with slash) to connect.
No need to run mongod locally if using Atlas.