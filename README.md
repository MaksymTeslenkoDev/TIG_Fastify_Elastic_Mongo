# Example Docker Compose project for Telegraf, InfluxDB, Grafana, Nginx, Fastify, MongoDb and Elasticsearch

This an example project to show the TIG (Telegraf, InfluxDB and Grafana) stack with Fatify application, MongoDB, ElasticSearch and Nginx.

## Start the stack with docker compose

```bash
$ docker-compose up
```

## Services and Ports

### Grafana
- URL: http://localhost:3001
- User: admin 
- Password: admin 

### Telegraf
- Port: 8125 UDP (StatsD input)

### InfluxDB
- Port: 8086 (HTTP API)
- User: admin 
- Password: admin 
- Database: influx

### MongoDB 
- Port: 27017
- DB: HSA_DB

### Elasticsearch
- Port:9200
- Index: movies

## Generate Load
```
cd app/scripts
node generateLoad.js
```

### Example of load metrics after generated load

Network
![Network](./images/Network_1.png "Network load")

System
![System](./images/System_1.png "System load")

Docker
![Docker 1](./images/Docker_1.png "Docker load")
![Docker 2](./images/Docker_2.png "Docker load")
![Docker 3](./images/Docker_3.png "Docker load")

Elasticsearch
![Elasticsearch 1](./images/ElasticSearch_1.png "Elasticsearch load")
![Elasticsearch 2](./images/ElasticSearch_2.png "Elasticsearch load")
![Elasticsearch 3](./images/ElasticSearch_3.png "Elasticsearch load")

Mongo
![MongoDB 1](./images/Mongo_1.png "Mongo load")
![MongoDB 2](./images/Mongo_2.png "Mongo load")


## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

