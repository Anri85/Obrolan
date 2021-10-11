const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// getting env variables
const PORT = process.env.PORT || 5000;
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

// setup twilio client
const twilioClient = require('twilio')(accountSID, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (request, response) => {
    response.send('Hello world!');
});

// route for trigger stream client and then send twilio sms
app.post('/', (request, response) => {
    // mengambil data dari stream
    const { message, user: sender, type, members } = request.body;

    if (type === 'message.new') {
        members.filter((member) => member.user_id !== sender.id).forEach(({ user }) => {
            if (!user.online) {
                twilioClient.messages.create({
                    body: `You have a new message from ${message.user.fullname} - ${message.text}`,
                    messagingServiceSid: messagingServiceSid,
                    to: user.phoneNumber
                }).then(() => {
                    console.log('Message Sent');
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
        return response.status(200).json({ status: true, message: 'Message Sent!' });
    }
    return response.status(200).json({ status: true, message: 'Not A New Message Request!' });
});

app.use('/api/user', require('./routes/AuthenticationRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
});