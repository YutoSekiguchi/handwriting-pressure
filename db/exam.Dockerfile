FROM mysql:8.0

ENV TZ=Asia/Tokyo
COPY init/exam_create_tables.sql /docker-entrypoint-initdb.d/exam_create_tables.sql
COPY my.conf /etc/mysql/conf.d/my.conf

CMD ["mysqld", "--character-set-server=utf8", "--collation-server=utf8_unicode_ci", "--default-authentication-plugin=mysql_native_password"]