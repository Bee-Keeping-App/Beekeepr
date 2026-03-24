//this file holds functions that abstract needed functions for accessing backend

const curURL:string = "http://localhost:3000";


export type tokenReturn = {
    code: number;
    accessToken: string | null;
    refreshToekn: string | null;
};

//attempts a login and retuns the tokens for the user successfull
export async function attemptLogin(email: string, password: string): Promise<tokenReturn> {
    //debug code
    //alert("LOGIN 0");
    const response = await fetch(curURL + "/api/auth/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    
    const body = await response.json();

    // debug code
    // alert("LOGIN 1");

    if(response.status != 200) {
        return {code: response.status, accessToken: null, refreshToekn: null};
    }


    const refresh:string | null = response.headers.get('set-cookie');
    const access:string = body.accessToken;
    
    return {code: response.status, accessToken: access, refreshToekn: refresh};
}

//attempts to register a user and returns the tokens required to access if true

export async function attemptRegister(email: string, password: string): Promise<tokenReturn> {
    // debug code
    // alert("REGISTER 0")
    const response = await fetch(curURL + "/api/accounts", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    });

    // debug code
    // alert("REGISTER 1")
    const body = await response.json();

    // debug code
    // alert(response.status);

    if(response.status != 201) {
        return {code: response.status, accessToken: null, refreshToekn: null};
    }

    
    const refresh:string | null = response.headers.get('set-cookie');
    const access:string = body.accessToken;
    
    return {code: response.status, accessToken: access, refreshToekn: refresh};
}