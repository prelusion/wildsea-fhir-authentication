# create databases
CREATE DATABASE IF NOT EXISTS `fhir-authentication`;
CREATE DATABASE IF NOT EXISTS `fhir-authentication-test`;

# create root user and grant rights
CREATE USER 'admin' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON *.* TO 'admin';
