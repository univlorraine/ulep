const rootUsername = 'ulep';
const rootPassword = '!ChangeMe!';
const database = 'ulep';

// Connect to the admin database
db = new Mongo().getDB('admin');

// Create root user
db.createUser({
  user: rootUsername,
  pwd: rootPassword,
  roles: [
    { role: 'userAdminAnyDatabase', db: 'admin' },
    { role: 'readWrite', db: database },
  ],
});

// Switch to application database
db = new Mongo().getDB(database);

// Create application user
db.createUser({
  user: rootUsername,
  pwd: rootPassword,
  roles: [{ role: 'readWrite', db: database }],
});
