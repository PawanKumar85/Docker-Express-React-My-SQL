# MySQL Database Setup with Docker Compose

## 1. Create a docker-compose.yml File: 

In your project directory, create a `docker-compose.yml` file with the following content:

```yaml
services:
  app:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - DB_HOST=mysqldb
      - DB_USER=user
      - DB_PASSWORD=password
      - DB_NAME=task_manager
      - DB_PORT=3306
      - PORT=4000
    depends_on:
      - mysqldb
    networks:
      - task_network

  mysqldb:
    image: mysql:latest
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: task_manager
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - task_network

volumes:
  mysql_data:

networks:
  task_network:
    driver: bridge
```

This configuration sets up a MySQL container with the following environment variables:

- `MYSQL_ROOT_PASSWORD`: Root password for MySQL.
- `MYSQL_DATABASE`: Name of the database to create.
- `MYSQL_USER`: Username for the new user.
- `MYSQL_PASSWORD`: Password for the new user.

It also maps port 3306 on the host to port 3306 in the container and defines a named volume `mysql_data` to persist MySQL data.

## 2. Start the Services:

Navigate to your project directory and run:

```bash
docker-compose up -d
```

This command starts the MySQL container in detached mode.

## 3. Access the MySQL Container:

To access the MySQL command-line interface inside the container, execute:

```bash
docker exec -it <container_id or container_name> mysql -u root -p
```

When prompted, enter the root password: `root`.

## 4. Create the tasks Table:

Once inside the MySQL shell, select the `task_manager` database:

```bash
USE task_manager;
```

Then, create the tasks table with the following structure:

```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  status BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

This command creates a `tasks` table with the specified columns and default values.

## 5. Verify the Table Creation:

To confirm that the `tasks` table has been created successfully, run:

```bash
SHOW TABLES;
```

## 6. Exit the MySQL Shell:

Type `exit` to leave the MySQL shell.

## 7. Stop the Services:
```bash
docker-compose down
```
