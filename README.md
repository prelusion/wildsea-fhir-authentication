# wildsea-fhir-authentication

mkdir /tmp/mysql-data

docker run --name basic-mysql --rm -v /tmp/mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=ANSKk08aPEDbFjDO -e MYSQL_DATABASE=fhir-authentication -p 3307:3307 -it mysql:8.0
