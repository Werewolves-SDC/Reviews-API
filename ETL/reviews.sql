COPY reviews
FROM '/Users/keewooklee/Downloads/reviews.csv'
DELIMITER ','
null as 'null' CSV HEADER;
