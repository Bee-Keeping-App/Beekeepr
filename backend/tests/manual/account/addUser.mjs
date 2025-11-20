import 'dotenv/config';

/* HOW TO USE ME */
/* 

            I take 2 command line args
            1. A username
            2. A password

            Thats it. There are no restricted chars at the moment

*/

// constants
const URL = (process.env.USE_PROD == 'true') ? process.env.PROD_URL : `http://localhost:3000`;
const args = process.argv;
var VALID_INPUT = false;

if (args.length != 4) {
    console.log('Usage: $node addUser.js username password');
} else {
    VALID_INPUT = true;
}

(async function() {

    if (VALID_INPUT) {
        const payload = {
            'username': process.argv[2],
            'password': process.argv[3]
        };

        const res = await fetch(`${URL}/account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        console.log(res);
        console.log(data);
        console.log(`User: ${args[2]}\nPass: ${args[3]}`);
    }
})();