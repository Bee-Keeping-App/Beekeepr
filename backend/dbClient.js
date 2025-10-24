const { mongodb } = require('mongodb')
const { argon } = require('argon2')

class MongoClient {

    // should initialize core vars, but not connect (construct can't be async)
    constructor(connectionString) {
        
        this.cString = connectionString;
        this.client = new mongodb(connectionString);
        this.db = null;
    }


    // returns t/f if the client is connected
    async isConnected() {
        try{
            const res = await this.client.isConnected();
            return res;
        } catch(error) {
            return false;
        }
    }


    // make the connection
    async connect() {
        await this.client.connect();
        this.db = this.client("beekeepR");
    }


    // given a username, check the database for a user entry. Throw an error if you can't find one (or return null?)
    async getUser(username) {
        const collection = this.db.collection('login');
        
        try {

            // find command on the login collection
            const res = await collection.findOne({ username: username });
            
            // return the object
            return res;

        } catch(error) {
            throw err('Could not process query');
        }
    }

    
    // compare hashes
    async comparePasswords(attempt, hash) {
        if (await argon.verify(hash, attempt)) {
            return true;
        } else {
            return false;
        }
    }
}

// export the client
export {MongoClient};