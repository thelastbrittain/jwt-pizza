# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      | home.jsx           | None              | None         |
| Register new user<br/>(t@jwt.com, pw: test)         | register.tsx       | [PUT] /api/auth   |INSERT INTO user (name, email, password VALUES (?, ?, ?) INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)              |
| Order pizza                                         |menu.tsx            |[GET] /api/ordermenu [GET] /api/franchise| SELECT * FROM menu SELECT id, name FROM franchise SELECT id, name FROM store WHERE franchiseId=?             |
| Verify pizza                                        |delivery            | [POST] /api/order/verify| INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now()) INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?)             |
| View profile page                                   |dinerDashboard.tsx      |[GET] api/order    |`SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT ${offset},${config.db.listPerPage}` `SELECT id, menuId, description, price FROM orderItem WHERE orderId=?`             |
| View franchise<br/>(as diner)                       |franchiseDashboard.tsx|  None                 |   None           |
| Logout                                              | logout.jsx         |  [DELETE] /api/auth| DELETE FROM auth WHERE token=?             |
| View About page                                     |about.tsx           | None              | None         |
| View History page                                   |history.tsx         |None               | None         |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |login.tsx           | [PUT] /api/auth   | INSERT INTO auth (token, userId) VALUES (?, ?)             |
| View franchise<br/>(as franchisee)                  |franchiseDashboard.jsx|[GET] /api/franchice|SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?, SELECT id, name FROM franchise WHERE id in (${franchiseIds.join(',')})              |
| Create a store                                      |createStore.tsx     | [POST] /api/franchise/${franchise.id}/store                  |INSERT INTO store (franchiseId, name) VALUES (?, ?)              |
| Close a store                                       |closeStore.tsx      |[DELETE] /api/franchise/${franchise.id}/store/${store.id}                  |DELETE FROM store WHERE franchiseId=? AND id=?              |
| Login as admin<br/>(a@jwt.com, pw: admin)           login.tsx           | [PUT] /api/auth   | INSERT INTO auth (token, userId) VALUES (?, ?)             |
| View Admin page                                     |adminDashboard.tsx  |[GET] /api/franchicse| SELECT id, name FROM franchise, SELECT id, name FROM store WHERE franchiseId=?              |
| Create a franchise for t@jwt.com                    |createFranchise.tsx | [POST] /api/franchise| SELECT id, name FROM user WHERE email=?, INSERT INTO franchise (name) VALUES (?), INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)              |
| Close the franchise for t@jwt.com                   | closeFranchise.tsx | [DELETE] /api/franchise/${franchise.id} |DELETE FROM store WHERE franchiseId=?, DELETE FROM userRole WHERE objectId=?, DELETE FROM franchise WHERE id=?              |
