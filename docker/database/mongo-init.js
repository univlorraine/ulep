const rootUsername = "ulep";
const rootPassword = "!ChangeMe!";
const database = "ulep";

db = new Mongo().getDB("admin");

db.createUser({
    user: rootUsername,
    pwd: rootPassword,
    roles: [
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "readWrite", db: database },
    ],
});

db = new Mongo().getDB(database);

db.createUser({
    user: "ulep",
    pwd: "!ChangeMe!",
    roles: [{ role: "readWrite", db: database }],
});
