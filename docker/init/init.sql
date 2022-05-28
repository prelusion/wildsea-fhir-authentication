# create databases
CREATE DATABASE IF NOT EXISTS `fhir-authentication`;
CREATE DATABASE IF NOT EXISTS `fhir-authentication-test`;

drop user admin;
flush privileges;
create user admin identified by 'admin';
GRANT ALL PRIVILEGES ON *.* TO 'admin';
