const fs = require('fs');
const https = require('https');

const userId = process.env.HABITICA_USER_ID;
const apiKey = process.env.HABITICA_API_KEY;

if (!userId || !apiKey) {
  console.error('Missing HABITICA_USER_ID or HABITICA_API_KEY');
  process.exit(1);
}

let count = 1;
if (fs.existsSync('count.json')) {
  count = JSON.parse(fs.readFileSync('count.json', 'utf8')).count;
}

function generateChallenge(num) {
  const seed = (num * 7919) % 1000000;
  const rand = (max) => seed % max;
  const difficulty = Math.ceil(num / 10);
  const isVirtual = rand(2) === 0;

  const realWorld = [
    'Say hi to one stranger',
    'Hold eye contact for 3 seconds with someone',
    'Smile at 3 people and see if they smile back',
    'Ask a stranger for the time',
    'Compliment something you notice about someone',
    'Wave or nod at someone',
    'Ask someone for directions',
    'Thank someone genuinely for something small',
    'Strike up a 2-minute conversation with someone in line',
    'Ask someone at the gym about their workout routine',
    'Sit next to someone new at an event and introduce yourself',
    'Ask someone for their opinion on something',
    'Initiate conversation at a bus stop or waiting area',
    'Ask someone\'s name and remember it',
    'Give a specific compliment to someone you don\'t know well',
    'Join a conversation between two people for 1 minute',
    'Have a 5+ minute conversation with a stranger',
    'Share a small personal detail about yourself with someone new',
    'Attend a group activity and introduce yourself to 3+ people',
    'Ask someone for advice on something real',
    'Propose getting together or exchanging contact info',
    'Attend a social event alone and stay 30+ min',
    'Lead or speak up in a group setting',
    'Have a deeper conversation about something that matters to you',
  ];

  const virtual = [
    'Text someone you haven\'t talked to in 3+ months',
    'Like or comment on a friend\'s social post',
    'Send a meme or funny thing to someone',
    'Message an old acquaintance to say hi',
    'React to Instagram story with more than emoji',
    'Send someone a photo or update about your day',
    'Ask a friend how their week has been',
    'Send a voice message instead of text',
    'Video call someone and initiate it yourself',
    'Share something you\'ve been thinking about',
    'Reach out to someone after a conflict',
    'Post something genuine on social media',
    'Start a group chat with people you\'re less close to',
    'Ask someone for their honest feedback',
    'Call someone instead of texting',
    'Share a creative work or writing with someone',
    'Have a real conversation about feelings',
    'Post something that reveals a real part of you',
    'Reach out to someone you admire or look up to',
    'Have a deeper conversation about values or dreams',
    'Be vulnerable in a message about something you care about',
  ];

  const pool = isVirtual ? virtual : realWorld;
  const filtered = pool.filter((_, i) => {
    const itemDiff = Math.ceil((i + 1) / 3);
    return itemDiff === difficulty || itemDiff === Math.max(1, difficulty - 1) || itemDiff === Math.min(10, difficulty + 1);
  });
  
  const chosen = filtered.length > 0 ? filtered[rand(filtered.length)] : pool[rand(pool.length)];

  return {
    num,
    text: chosen,
    type: isVirtual ? 'virtual' : 'real-world',
    difficulty
  };
}

function pushToHabitica(text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      type: 'todo',
      text: text,
      notes: 'From +exposure daily'
    });

    const options = {
      hostname: 'habitica.com',
      path: '/api/v3/tasks/user',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'x-api-user': userId,
        'x-api-key': apiKey,
        'x-client': 'exposure-daily'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          resolve(true);
        } else {
          reject(new Error(`Habitica API error: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  try {
    const challenge = generateChallenge(count);
    
    console.log(`Challenge #${challenge.num}`);
    console.log(`Text: ${challenge.text}`);
    
    await pushToHabitica(challenge.text);
    
    count += 1;
    fs.writeFileSync('count.json', JSON.stringify({ count }, null, 2));
    
    console.log('✓ Pushed to Habitica');
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  }
}

run();
