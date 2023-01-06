### Running with docker in server

```sh
# Network is necessary
docker network create \
  --driver=bridge \
  --subnet=171.1.0.0/16 \
  sociahigh_network

# Build image
docker build -t sociahigh_nginx .

# Run container
docker run -d \
 --name sociahigh_nginx \
 --restart always \
 -p 80:80 \
 --ip 171.1.0.80 \
 --network sociahigh_network \
 sociahigh_nginx
```
