# Ring Doorbell

This is our College Group Project with the Raspberry Pi: 
A Ring doorbell with Display for bidirectional Video calls and many other features.

## Development

### Server

1. Change into the */server* directory

2. Clone *.env.sample* and name it just *.env* 

3. ```bash
   npm run dev
   ```

### Web-Client

1. Change into the */web* directory

2. ```bash
   npm run dev
   ```

### Database

See [README](./db/README.md) in db-folder on how to set up a local DB with Docker.

## Migrations

Generate new DB Migration files after every Schema change, by running following command under */server*:

```bash
npm run migration:generate
```



