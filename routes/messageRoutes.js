const express = require('express');
const router = express.Router();
const axios= require('axios')
const Message = require('../models/messageModel');
const SentMessage = require('../models/sentMessageModal')

require('dotenv').config();

// API endpoint to get messages of a particular contact
router.get('/messages/:contactId', async (req, res) => {
  const { contactId } = req.params;

  try {
    const receivedMessages = await Message.find({ from: contactId });
    const sentMessages = await SentMessage.find({ to: contactId });
    // Combine the arrays and sort them by timestamp
    let allMessages = []
    receivedMessages.forEach((msg)=> allMessages.push(msg))
    sentMessages.forEach((msg)=> allMessages.push(msg))
    allMessages.sort(
      (a, b) => a.timestamp - b.timestamp
    );

    res.json(allMessages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

router.post('/messages/send', async (req, res) => {
  console.log(1);
  const { to, content, } = req.body;
  console.log(2);
  try{
    console.log(3);
    const token = process.env.ACCESS_TOKEN
    let data = JSON.stringify({
      "messaging_product": "whatsapp",
      "to": to,
      "type": "text",
      "text": {
        "preview_url": true,
        "body": content
      }
    });
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://graph.facebook.com/v16.0/' + '114778888258379' + '/messages',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ token
      },
      data: data
    };
    axios.request(config)
    .then(async(response) => {
        console.log(JSON.stringify(response.data));
        const newMessage= await SentMessage({
          to:to,
          text:content,
          id:response.data.messages[0].id
        })
        await newMessage.save();
        console.log("Message saved successfully");
      })
    .catch((error) => {
        console.log(error);
      });
    res.status(200).json({message: 'text send sucessfully'})
  }catch(error){
    res.status(500).json({ message: error });
  }
});

module.exports = router;
