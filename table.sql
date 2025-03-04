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