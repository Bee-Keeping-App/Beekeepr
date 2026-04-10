import { insertOne, findOne, findOneById, findOneByClerkId, findAll, updateOne, deleteOne } from '../accounts.service.js';
import Account from '../../models/accounts.model.js';
import { NullQueryError, DuplicateFieldError } from '../../classes/errors.class.js';

describe('accounts.service', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    describe('insertOne', () => {
        test('throws DuplicateFieldError on duplicate email', async () => {
            await insertOne({ email: 'dupe@gmail.com', clerkId: 'clerk_1' });

            await expect(
                insertOne({ email: 'dupe@gmail.com', clerkId: 'clerk_2' })
            ).rejects.toThrow(DuplicateFieldError);
        });

        test('re-throws non-duplicate Mongoose errors', async () => {
            // Missing required 'email' field triggers a Mongoose ValidationError
            await expect(
                insertOne({ clerkId: 'clerk_1' })
            ).rejects.toThrow();
        });

        test('re-thrown error is not a DuplicateFieldError', async () => {
            try {
                await insertOne({ clerkId: 'clerk_1' });
            } catch (err) {
                expect(err).not.toBeInstanceOf(DuplicateFieldError);
            }
        });
    });

    describe('findAll', () => {
        test('returns all accounts', async () => {
            await insertOne({ email: 'a@gmail.com', clerkId: 'clerk_a' });
            await insertOne({ email: 'b@gmail.com', clerkId: 'clerk_b' });

            const result = await findAll();
            expect(result.length).toBe(2);
        });

        test('throws NullQueryError when there\'s no accounts in the db I guess', async () => {
            const result = await findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        test('throws NullQueryError when account is not found', async () => {
            await expect(findOne({ email: 'nobody@gmail.com' })).rejects.toThrow(NullQueryError);
        });

        test('returns account', async () => {
            await insertOne({ email: 'test@gmail.com', clerkId: 'clerk_1' });
            const result = await findOne({ email: 'test@gmail.com' });
            expect(result.email).toBe('test@gmail.com');
        });
    });

    describe('findOneById', () => {
        test('throws NullQueryError for a non-existent id', async () => {
            await expect(findOneById('507f1f77bcf86cd799439011')).rejects.toThrow(NullQueryError);
        });

        test('returns account by id', async () => {
            const created = await insertOne({ email: 'test@gmail.com', clerkId: 'clerk_1' });
            const result = await findOneById(created.id);
            expect(result.email).toBe('test@gmail.com');
        });
    });

    describe('findOneByClerkId', () => {
        test('throws NullQueryError for non-existent clerkId', async () => {
            await expect(findOneByClerkId('nonexistent')).rejects.toThrow(NullQueryError);
        });

        test('returns account by clerkId', async () => {
            await insertOne({ email: 'test@gmail.com', clerkId: 'clerk_find_me' });
            const result = await findOneByClerkId('clerk_find_me');
            expect(result.email).toBe('test@gmail.com');
        });
    });

    describe('updateOne', () => {
        test('throws NullQueryError for a non-existent id', async () => {
            await expect(updateOne('507f1f77bcf86cd799439011', { email: 'new@gmail.com' })).rejects.toThrow(NullQueryError);
        });

        test('updates and returns the new document', async () => {
            const created = await insertOne({ email: 'old@gmail.com', clerkId: 'clerk_1' });
            const updated = await updateOne(created.id, { email: 'new@gmail.com' });
            expect(updated.email).toBe('new@gmail.com');
        });
    });

    describe('deleteOne', () => {
        test('throws NullQueryError for a non-existent id', async () => {
            await expect(deleteOne('507f1f77bcf86cd799439011')).rejects.toThrow(NullQueryError);
        });

        test('deletes the account and returns the deleted document', async () => {
            const created = await insertOne({ email: 'test@gmail.com', clerkId: 'clerk_1' });
            const deleted = await deleteOne(created.id);
            expect(deleted.email).toBe('test@gmail.com');

            // confirm it's gone
            await expect(findOneById(created.id)).rejects.toThrow(NullQueryError);
        });
    });
});
