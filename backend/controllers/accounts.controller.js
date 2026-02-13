import * as Accounts from "../services/accounts.service.js";
import * as Auth from '../services/auth.service.js';
import catchAsync from '../utils/catchAsync.js';

/* Read all caller */
export const getAllAccounts = catchAsync(async (req, res, next) => {
    const accounts = await Accounts.findAll();
    res.status(200).json({ accounts });
});

/* Read one caller */
export const getOneAccount = catchAsync(async (req, res, next) => {
    const account = await Accounts.findOneById(req.params.id);
    res.status(200).json({ account });
});

/* Make an Account */
export const registerAccount = catchAsync(async (req, res, next) => {

    /* me calculating my mlfd grade:

        * 10750 in hw points / 12800 in total points = 0.8398
        * 54 in quiz points / 86 in total points = 0.6279
        * 26.82 on the exam / 30 in total exam = 0.894
        * 
        * final grade: 50% hw, 20% quiz, 30% final
        * 0.5 * 0.8398 + 0.2 * 0.6279 + 0.3 * 0.894
        * 0.4199 + 0.1258 + 0.2682 = 0.8139
        * cope rounding: 0.42 + 0.13 + 0.27 = 0.82
        * 
        * fml bro ik ik ts 90 on the final :sob:
    */

    // login handled by auth service
    const { accessToken, refreshToken } = await Auth.handleSignup(req.body);

    // attach tokens and send request
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: (process.env.USE_PROD == 'true') });
    return res.status(201).json({ accessToken });

});

/* Update caller */
export const updateAccountInfo = catchAsync(async (req, res, next) => {
    
    // finds an account by id then updates it (idempotent operation)
    const account = await Accounts.updateOne(
        req.user,
        req.body
    );

    res.status(200).json({ account });
});

/* Delete caller */
export const deleteAccount = catchAsync(async (req, res, next) => {
    
    // deletes the account
    await Accounts.deleteOne(req.user);
    
    // removes the refresh token from the request
    res.cookie('refreshToken', null, { httpOnly: true, secure: (process.env.USE_PROD == 'true'), maxAge: 0 });
    
    res.status(204).send();
});