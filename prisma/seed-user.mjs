import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();

    // Extract database name from URL or default to 'sajidhgn'
    const dbName = process.env.DATABASE_URL.split('/').pop().split('?')[0] || 'sajidhgn';
    const db = client.db(dbName);

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const users = db.collection('User');

    // Find existing
    const existing = await users.findOne({ username: 'admin' });
    if (existing) {
        console.log('User already exists:', existing.username);
    } else {
        await users.insertOne({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
        });
        console.log('User created: admin');
    }

    await client.close();
}

main().catch(console.error);
