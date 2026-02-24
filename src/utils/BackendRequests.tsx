//this file holds functions that abstract needed functions for accessing backend
const curURL:string = "http://localhost:3000";


export type tokenReturn = {
    successful: boolean;
    accessToken: string | null;
    refreshToekn: string | null;
};

//attempts a login and retuns the tokens for the user successfull
export async function attemptLogin(email: string, password: string): Promise<tokenReturn> {
    const response = await fetch(curURL + "/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    
    response.json();

    if(response.status != 200) {
        return {successful: false, accessToken: null, refreshToekn: null};
    }


    const body = await response.json();


    
    const refresh:string | null = response.headers.get('set-cookie');
    const access:string = body.accessToken;
    
    return {successful: true, accessToken: access, refreshToekn: refresh};
}

//attempts to register a user and returns the tokens required to access if true

export async function attemptRegister(email: string, password: string): Promise<tokenReturn> {
    const response = await fetch(curURL + "/api/accounts", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    response.json();

    if(response.status != 201) {
        return {successful: false, accessToken: null, refreshToekn: null};
    }

    const body = await response.json();
    
    const refresh:string | null = response.headers.get('set-cookie');
    const access:string = body.accessToken;
    
    return {successful: true, accessToken: access, refreshToekn: refresh};
}