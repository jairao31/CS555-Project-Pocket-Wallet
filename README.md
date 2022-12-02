# CS555_AgileProject_Team13
# Pocket-Wallet 💰
###### Pocket-Wallet is a parent-child based web application for pocket money management.

## Steps to run the application

1. npm i
2. npm start

## Features:
- Parent Registeration (Sign-up/Sign-In with google)
1. Parent will login and then add new child and edit details
2. After filling the information of child on click of submit button the invite link will sent to child’s email id.
3. By clicking on the invite link, child will login to the web app and/or change the password or edit the profile.
- Child can see:
1. Statistic Representation of transactions daily, monthly
2. Activity / Summary of transaction and available balance
- Child can have features:
1. Send email of monthly statement of transactions
2. Request Money
3. Auto request money (Optional)
- Parent can see:
1. Statistic Representation of transactions daily, monthly
2. Activity / Summary of transaction and available balance in respective childs account
3. A dropdown toswitch and see above views of particular child
- Parent (Admin) can have features:
1. Send email of monthly statement of transactions
2. Allocate Money -> as soon as parent allocate money update the transactions collection.
3. Auto allocate money (Optional)
4. Accept the request and send the requested money -> as soon as parent accept money update transactions collection.
5. Delete childs account, edit/update his/her details
- Technologies used:
1. React.js: Front-end framework
2. Node.js: Backend
3. Authentication: Google Firebase Auth 
4. Database: Firestore-Database
