-- dialect: postgres

CREATE DATABASE profile_service_db;
CREATE DATABASE identity_service_db;

GRANT ALL PRIVILEGES ON DATABASE profile_service_db TO root;
GRANT ALL PRIVILEGES ON DATABASE identity_service_db TO root;
