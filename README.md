<h1 align="center">Sociahigh </h1>
<p align="center">
Sociahigh is a complete application developed using the concept of containerized microservices. This application includes a <code>node</code> with <code>fastify</code> and <code>typescript</code> backend, a <code>react</code>, <code>tailwind</code> and <code>typescript</code> frontend, <code>nginx</code> as http server and a <code>custom npm package</code> for use in the backend environment. Every microservice and the http server is containerized with <code>docker</code>.
The purpose of the application is the management of small events, providing the management of guests, the items they are taking to the event and updating everyone about changes.
</p>

<br />

<h3 align="center"> 
	🟢 Status: Concluded
</h3>

<br />

<h3 align="center">⏮️ How to run the <b>backend</b></h3>
<p align="center">The first step after downloading the project is to create a docker network</p>
<pre>
docker network create \
  --driver=bridge \
  --subnet=171.1.0.0/16 \
  sociahigh_network
</pre>
<p align="center">Build all the Docker images in the root of the main projects</p>
<pre>
docker build -t sociahigh_user_microservice ./sociahigh_user_microservice
</pre>
<pre>
docker build -t sociahigh_event_microservice ./sociahigh_event_microservice
</pre>
<pre>
docker build -t sociahigh_nginx ./ sociahigh_nginx
</pre>

<p align="center">Run the containers</p>
<pre>
docker run -d \
  --name sociahigh_user_microservice \
  --restart always \
  -p 8800:8800 \
  --ip 171.1.0.88 \
  --network sociahigh_network \
  sociahigh_user_microservice
</pre>
<pre>
docker run -d \
  --name sociahigh_event_microservice \
  --restart always \
  -p 8900:8900 \
  --ip 171.1.0.89 \
  --network sociahigh_network \
  sociahigh_event_microservice
</pre>
<pre>
docker run -d \
  --name sociahigh_nginx \
  --restart always \
  -p 80:80 \
  --ip 171.1.0.80 \
  --network sociahigh_network \
  sociahigh_nginx
</pre>

<p align="center">The server will go up at port 80 and you can call every microservice using it routes through nginx. You can run a <b>portainer server</b> using the command below:</p>
<pre>

docker volume create portainer_data

docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest
</pre>

<h3 align="center">⏭️ How to run the <b>frontend</b></h3>
<p align="center">
Go to the `sociahigh_frontend_web` folder and run the script:
</p>
<pre>
npm run dev
</pre>
<p align="center">
The server will go up at port 5173
</p>

<br />

<h3 align="center">🧠 Understanding</h3>
<p align="center">
<b><i>A POSTMAN COLLECTION IS INCLUDED IN THE PROJECT</i></b>. So, you can import this collection and have fun. <br />
</p>

<br />

<h3 align="center">📸 System prints</h3>
<p align="center">See some system screens below</p>
<table>
  <tr>
    <td><img src="https://i.imgur.com/fBp9VJW.png" alt="Home"></td>		
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/i3Jgz5E.png" alt="Manage"></td>		
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/5AH7JAw.png" alt="Element"></td>		
  </tr>
</table>

<br />

<br />
<h3 align="center">🏛 ERD</h3>
<p align="center">The complete database structure:</p>
<h1 align="center">
  <img alt="ERD" src="https://i.imgur.com/C9cck52.png" />
</h1>

<br />

<h3 align="center">🎨 Contributor(s)</h4>
<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/ItaloServio">
        <img src="https://avatars1.githubusercontent.com/u/60075865?s=460&u=407042a6a58218d29495ca19dda1bef5ca4540c3&v=4" width="100px;" alt="Profile"/>
        <br />
        <sub>
          <b>Ítalo Sérvio</b>
        </sub>
      </a>
  </tr>  
</table>
