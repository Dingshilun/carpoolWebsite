drop database if exists carpool;
create database carpool;
use carpool;

create table users(
  UserID varchar(20) primary key not null,
  Password varchar(15) not null,
  Gender char(1),
  Introduction text,
  face varchar(30)
)DEFAULT CHARSET=utf8;
create table userPic(
  UserID varchar(20),
  Pics varchar(20),
  foreign key(UserID) references users(UserID)
)DEFAULT CHARSET=utf8;
create table carpool(
  PoolID int primary key auto_increment,
  Departure char(10),
  Destination char(10),
  D_date datetime,
  Capacity int not null,
  contact varchar(30)
)DEFAULT CHARSET=utf8;

create table joinpool(
  PoolID int,
  UserID varchar(20),
  primary key(PoolID,UserID),
  foreign key(PoolID) references carpool(PoolID),
  foreign key(UserID) references users(UserID)
)DEFAULT CHARSET=utf8;

create table friends(
  UserID1 varchar(20),
  UserID2 varchar(20),
  primary key(UserID1,UserID2),
  foreign key(UserID1) references users(UserID),
  foreign key(UserID2) references users(UserID)
)DEFAULT CHARSET=utf8;

create table contact_content(
  GroupID int primary key auto_increment,
  Sender varchar(20),
  foreign key(Sender) references users(UserID),
  Content text
)DEFAULT CHARSET=utf8;

create table join_contact(
  GroupID int,
  UserID varchar(20),
  foreign key(GroupID) references contact_content(GroupID),
  foreign key(UserID) references users(UserID)
)DEFAULT CHARSET=utf8;
