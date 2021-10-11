const { connect } = require('getstream');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;

// importing all necessaries enviroment variabel
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const login = async (request, response, next) => {
    try {
        // getting all data from client
        const { username, password } = request.body;
        // make connection to stream
        const serverClient = connect(api_key, api_secret, app_id);
        // terhubung kedalam database getstream
        const client = StreamChat.getInstance(api_key, api_secret);
        // mengambil data dari database dan memeriksa kecocokannya dengan username
        const { users } = await client.queryUsers({ name: username });

        // jika users tidak ditemukan
        if(!users.length) {
            return response.status(404),json({ status: false, message: 'Resource Not Found!' });
        };
        // jika users ditemukan periksa kecocokan password
        const success = await bcrypt.compare(password, users[0].hashPassword);
        // creating token for user
        const token = serverClient.createUserToken(users[0].id);

        if(success) {
            return response.status(200).json({ token, fullname: users[0].fullname, username, userId: users[0].id });
        } else {
            return response.status(400).json({ status: false, message: 'Incorrect Password!' });
        };
    } catch (error) {
        console.log(error);
    };
};

const register = async (request, response, next) => {
    try {
        // getting all data from client
        const { fullname, username, password, phoneNumber } = request.body;
        // creating random userID
        const userId = crypto.randomBytes(16).toString('hex');
        // make connection to stream
        const serverClient = connect(api_key, api_secret, app_id)
        // hashing password
        const hashPassword = await bcrypt.hash(password, 10);
        // creating token for user
        const token = serverClient.createUserToken(userId);

        response.status(201).json({ token, fullname, username, userId, hashPassword, phoneNumber });
    } catch (error) {
        console.log(error);
    };
};

module.exports = { login, register };