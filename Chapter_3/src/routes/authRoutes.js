import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const router = express.Router()

// Register a new user endpoint /auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    // Save the username and an irreversibly encrypted password
    // Save test@gmail.com | nawoehfeuhwadbawfesfea... (excrypted password)

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Save the new user and hashed password to the db
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        // now that we have a user, I want to add their first todo for them
        const defaultTodo = 'Hello! Add your first todo!';
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        // create a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.log(err.message);
        res.sendStatus(503);
    }


})

router.post('/login', async (req, res) => {
    // We get user's email and we look up the password associated with that email in the database
    // But we get it back and see it's encrypted which means that we cannot compare it to the one the user just used trying to login
    // So what we do is again, one way encrypt the password the user just entered
    // Encrypted password in database -> user entered password and password been encrypted -> compare both password see whether are they same
    const {username, password} = req.body;

    try{
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        // If user is not exist, return 404 NOT FOUND
        if (!user) {
            return res.status(404).send({ message: 'user not found' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.sendStatus(401).send({ message: 'Invalid password!' })
        } 
        console.log(user);
        // then we have a successful authentication
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn : '24h' });
        res.json({token})
    } catch (err) {
        console.log(err.message);
        res.sendStatus(503);
    }
})

export default router