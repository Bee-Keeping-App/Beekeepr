import 'dotenv/config';


/* HOW TO USE ME */
/* 

            I take 1 command line arg
            
            1. An access token (granted on registration / login)
            Thats it.

*/





// constants
const URL = (process.env.USE_PROD == 'true') ? process.env.PROD_URL : `http://localhost:3000`;
const args = process.argv;
var VALID_INPUT = false;

if (args.length != 3) {
    console.log('Usage: $node addUser.js accessToken');
} else {
    VALID_INPUT = true;
}

(async function() {

    if (VALID_INPUT) {

        const res = await fetch(`${URL}/account`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${args[2]}`
            }
        });

        const data = await res.json();
        console.log(res);
        console.log(data);
        console.log(`Access Token: ${args[2]}`);
    }
})();