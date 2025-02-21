
# Final NoSQL: Software Store Admin panel

There is data directory that have all collections


## Installation

Install my-project with npm

```bash
# 0. Go to data dir
    cd C:/YOUR_PATH/data/

# 1. Import customers collection
    mongoimport --db softwarestoreDB --collection customers --file customers.json --jsonArray

# 2. Import carts collection
    mongoimport --db softwarestoreDB --collection carts --file carts.json --jsonArray

# 3. Import orders collection
    mongoimport --db softwarestoreDB --collection orders --file orders.json --jsonArray

# 4. Import payments collection
    mongoimport --db softwarestoreDB --collection payments --file payments.json --jsonArray

# 5. Import softwares collection
    mongoimport --db softwarestoreDB --collection softwares --file softwares.json --jsonArray

# 6. Import cartItems collection
    mongoimport --db softwarestoreDB --collection cartItems --file cartItems.json --jsonArray

# Go back to all files
    cd ..

# 7. initialize npm
    npm init -y 

# 8. install librarys
    npm install express mongoose body-parser path bcrypt express-session

# Create admins
    node createadmin.js

# 9. Thats all run!!!
    node server.js
```

    
