
CREATE TABLE user(
    id int primary key AUTO_INCREMENT,
    name varchar(20),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

INSERT INTO user(name, contactNumber, email, password, status, role) values ('Admin','963852741','admin@admin.com', 'admin', 'true','admin');
INSERT INTO user(name, contactNumber, email, password, status, role) values ('test','963852741','testingnodehache@gmail.com', 'pass', 'true','user');

CREATE TABLE category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    primary key(id)
);

CREATE TABLE product(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    categoryId integer NOT NULL,
    description varchar(255),
    price float(20,2),
    status varchar(20),
    primary key(id)
);

CREATE TABLE bill(
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(200) NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    contactNumber varchar(255) NOT NULL,
    paymentMethod varchar(255) NOT NULL,
    total float(20,2) NOT NULL,
    productDetails JSON DEFAULT NULL,
    createdBy varchar(255) NOT NULL,
    primary key(id)
);