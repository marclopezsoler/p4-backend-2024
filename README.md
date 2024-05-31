# P4 - Backend en Typescript, Express y Prisma | Online Store Database

That database model simulates a DB from an online store, containing 4 entities: **Seller**, **Client**, **Product** & **Order**.

## Step to initialize

- Clone the repo
- Install all the dependencies: <code>bun install</code>
- Create the DB: <code>bun prisma db push</code>
- Fill the DB with seed data: <code>bun prisma db seed</code>
- Run the server <code>bun --hot src/server.ts</code>
- Access Prisma Studio: <code>bun prisma studio</code>
- Run the endpoints by using Thunder Client or searching them on your browser (ex. <code>http://localhost:8080/products</code>)


After the seeding is done, the DB is filled with:
- 5 sellers
- 10 clients
- 10 products
- 15 orders


## Description of the scripts

The endpoints are separated by entities, here's a brief explanation of what each should return when executed via http://localhost:8080:

### Sellers

<code>/sellers/</code>: Returns a list containing all the sellers.

<code>/sellers/id=:id</code>: Returns the seller corresponding to the entered ID. 

<code>/sellers/name=:name</code>: Returns all the sellers whose names contains the <code>name</code> entered.

### Clients

<code>/clients/</code>: Returns a list containing all the clients.

<code>/clients/id=:id</code>: Returns the client corresponding to the entered ID. 

<code>/clients/name=:name</code>: Returns all the clients whose names contains the <code>name</code> entered.

### Products

<code>/products/</code>: Returns a list containing all the products.

<code>/products/id=:id</code>: Returns the product corresponding to the entered ID.

<code>/products/name=:name</code>: Returns all the products whose names contains the <code>name</code> entered.

### Orders

<code>/orders/</code>: Returns a list containing all the orders.

<code>/orders/id=:id</code>: Returns the order corresponding to the entered ID. 

<code>/orders/seller=:id</code>: Returns the order that contains the entered sellerId. 

<code>/orders/client=:id</code>: Returns the order that contains the entered clientId. 

<code>/orders/product=:id</code>: Returns the order that contains the entered productId. 

<code>/orders/status=:status</code>: Returns the order that contains the entered status. 