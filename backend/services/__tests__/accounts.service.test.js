import { insertOne, findOne, findOneById, findAll, updateOne, deleteOne } from '../accounts.service.js';
import Account from '../../models/accounts.model.js';
import { NullQueryError, DuplicateFieldError } from '../../classes/errors.class.js';

describe('accounts.service', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    describe('insertOne', () => {
        test('throws DuplicateFieldError on duplicate email', async () => {
            await insertOne({ email: 'dupe@gmail.com', password: 'qwertyuiop', accessId: 1, refreshId: 1 });

            await expect(
                insertOne({ email: 'dupe@gmail.com', password: 'differentpw', accessId: 1, refreshId: 1 })
            ).rejects.toThrow(DuplicateFieldError);
        });

        test('re-throws non-duplicate Mongoose errors (line 37)', async () => {
            // Missing required 'password' field triggers a Mongoose ValidationError (no code 11000)
            await expect(
                insertOne({ email: 'test@gmail.com', accessId: 1, refreshId: 1 })
            ).rejects.toThrow(); // Mongoose ValidationError — not DuplicateFieldError
        });

        test('re-thrown error is not a DuplicateFieldError', async () => {
            try {
                await insertOne({ email: 'test@gmail.com', accessId: 1, refreshId: 1 });
            } catch (err) {
                expect(err).not.toBeInstanceOf(DuplicateFieldError);
            }
        });
    });

    describe('findAll', () => {
        test('returns all accounts', async () => {
            await insertOne({ email: 'a@gmail.com', password: 'qwertyuiop', accessId: 1, refreshId: 1 });
            await insertOne({ email: 'b@gmail.com', password: 'qwertyuiop', accessId: 1, refreshId: 1 });

            const result = await findAll();
            expect(result.length).toBe(2);
        });
    });

    describe('findOne', () => {
        test('throws NullQueryError when account is not found', async () => {
            await expect(findOne({ email: 'nobody@gmail.com' })).rejects.toThrow(NullQueryError);
        });

        test('returns account without password by default', async () => {
            await insertOne({ email: 'test@gmail.com', password: 'qwertyuiop', accessId: 1, refreshId: 1 });
            const result = await findOne({ email: 'test@gmail.com' });
            expect(result.password).toBeUndefined();
        });

        test('returns account with password when includePassword=true', async () => {
            await insertOne({ email: 'test@gmail.com', password: 'qwertyuiop', accessId: 1, refreshId: 1 });
            const result = await findOne({ email: 'test@gmail.com' }, true);
            expect(result.password).toBeDefined();
        });
    });

    describe('findOneById', () => {
        test('throws NullQueryError for a non-existent id', async () => {
            await expect(findOneById('507f1f77bcf86cd799439011')).rejects.toThrow(NullQueryError);
        });

        test('returns account without tokens by default', async () => {
            const created = await insertOne({ email: 'test@gmail.com', password: 'qwertyuiop', accessId: 1, refreshId: 1 });
            const result = await findOneById(created.id);
            expect(result.accessId).toBeUndefined();
            expect(result.refreshId).toBeUndefined();
        });

        test('returns account with tokens when includeTokens=true', async () => {
            const created = await insertOne({ email: 'test@gmail.com', password: 'qwertyuiop', accessId: 1, refreshId: 1 });
            const result = await findOneById(created.id, true);
            expect(result.accessId).toBeDefined();
            expect(result.refreshId).toBeDefined();
        });
    });

    describe('updateOne', () => {
        test('throws NullQueryError for a non-existent id', async () => {
            await expect(updateOne('507f1f77bcf86cd799439011', { email: 'new@gmail.com' })).rejects.toThrow(NullQueryError);
        });

        test('updates and returns the new document', async () => {
            const created = await insertOne({ email: 'old@gmail.com', password: 'qwertyuiop', accessId: 1, refreshId: 1 });
            const updated = await updateOne(created.id, { email: 'new@gmail.com' });
            expect(updated.email).toBe('new@gmail.com');
        });
    });

    describe('deleteOne', () => {
        test('throws NullQueryError for a non-existent id', async () => {
            await expect(deleteOne('507f1f77bcf86cd799439011')).rejects.toThrow(NullQueryError);
        });

        test('deletes the account and returns the deleted document', async () => {
            const created = await insertOne({ email: 'test@gmail.com', password: 'qwertyuiop', accessId: 1, refreshId: 1 });
            const deleted = await deleteOne(created.id);
            expect(deleted.email).toBe('test@gmail.com');

            // confirm it's gone
            await expect(findOneById(created.id)).rejects.toThrow(NullQueryError);
        });
    });
});
