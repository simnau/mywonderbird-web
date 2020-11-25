const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

let transporter = nodemailer.createTransport({
  service: 'Yahoo',
  secure: true,
  // Dummy account to transport mails.
  auth: {
    user: 'mywonderbirduser@yahoo.com',
    pass: 'rpfbfmnfgendfdlr',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

let MailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Nodemailer',
    link: 'http://localhost:8080/',
  },
});

async function sendFeedback({ user, body }) {
  let response = {
    body: {
      title: `You got feedback from ${user.email}`,
      table: {
        data: [
          {
            question:
              'What did you like about planning your trip in such a way?',
            answer: body['whatYouLike'],
          },
          {
            question: 'What could be improved?',
            answer: body['improvements'],
          },
          {
            question:
              'What would new functionality would you like to see when planning your trip on our platform?',
            answer: body['newFunctionality'],
          },
        ],
        columns: {
          customWidth: {
            question: '30%',
            answer: '70%',
          },
        },
      },
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: 'mywonderbirduser@yahoo.com',
    to: 'feedback@mywonderbird.com',
    subject: 'feedback',
    html: mail,
  };

  const result = await transporter.sendMail(message);

  return result.response;
}

module.exports = {
  sendFeedback,
};
