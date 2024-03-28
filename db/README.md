# PostgeSQL Database in Docker

This is the guide to set up the database for development.

If not done already, pull the postgres image from docker hub.

```bash
docker pull postgres
```

Then run the following command to create and start a new container.
```bash
docker run --name ring-db -p 5432:5432 -e POSTGRES_DB=ring -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -d postgres
```

This results in a new postgres running accessible with the following URL:
```
postgres://admin:admin@localhost:5432/ring
```