import * as Accounts from "../services/accounts.service.js";
import catchAsync from '../utils/catchAsync.js';

/* Read all caller */
export const getAllAccounts = catchAsync(async (req, res, next) => { // eslint-disable-line no-unused-vars
    const accounts = await Accounts.findAll();
    res.status(200).json({ accounts });
});

/* Read one caller */
export const getOneAccount = catchAsync(async (req, res, next) => { // eslint-disable-line no-unused-vars
    const account = await Accounts.findOneById(req.params.id);
    res.status(200).json({ account });
});

/* Create an Account profile linked to the authenticated Clerk user */
export const registerAccount = catchAsync(async (req, res, next) => { // eslint-disable-line no-unused-vars
    const account = await Accounts.insertOne({
        clerkId: req.auth.userId,
        ...req.body
    });
    return res.status(201).json({ account });
});

/* Update caller */
export const updateAccountInfo = catchAsync(async (req, res, next) => { // eslint-disable-line no-unused-vars
    const existing = await Accounts.findOneByClerkId(req.auth.userId);
    const account = await Accounts.updateOne(existing.id, req.body);
    res.status(200).json({ account });
});

/* Delete caller */
export const deleteAccount = catchAsync(async (req, res, next) => { // eslint-disable-line no-unused-vars
    const existing = await Accounts.findOneByClerkId(req.auth.userId);
    await Accounts.deleteOne(existing.id);
    res.status(204).send();
});
