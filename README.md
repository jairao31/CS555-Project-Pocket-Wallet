### CS555_AgileProject_Team13

# *Pocket-Wallet* 💰

Pocket-Wallet is a parent-child based web application for pocket money management.


## *Features:*
- Parent Registeration (Sign-up/Sign-In with google)
- Parent will login and then add new child and edit details
- After filling the information of child on click of submit button the invite link will sent to child’s email id.
- By clicking on the invite link, child will login to the web app and/or change the password or edit the profile.
- Child can see:
    - Statistic Representation of transactions daily, monthly
    - Activity / Summary of transaction and available balance
- Child can have features:
    - Send email of monthly statement of transactions
    - Request Money
    - Auto request money (Optional)
- Parent can see:
    - Statistic Representation of transactions daily, monthly
    - Activity / Summary of transaction  and available balance in respective childs account
    - A dropdown toswitch and see above views of particular child
- Parent (Admin) can have features:
    - Send email of monthly statement of transactions
    - Allocate Money -> as soon as parent allocate money update the transactions collection.
    - Auto allocate money (Optional)
    - Accept the request and send the requested money -> as soon as parent accept money update transactions collection.
    - Delete childs account, edit/update his/her details


## *Technologies used:*
**Next.js:**  Front-end framework

**Node.js:** Backend 

**Google Firebase:**  Authentication, Realtime-Database
