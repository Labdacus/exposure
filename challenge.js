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
    // Level 1
    'Say hi to one stranger',
    'Hold eye contact for 3 seconds with someone',
    'Smile at 3 people and see if they smile back',
    'Ask a stranger for the time',
    'Compliment something you notice about someone',
    'Wave or nod at someone',
    'Ask someone for directions',
    'Thank someone genuinely for something small',
    'Make brief eye contact and smile at someone',
    'Say "excuse me" politely to get past someone',
    // Level 2
    'Strike up a 2-minute conversation with someone in line',
    'Ask someone at the gym about their workout routine',
    'Sit next to someone new at an event and introduce yourself',
    'Ask someone for their opinion on something',
    'Initiate conversation at a bus stop or waiting area',
    'Ask someone\'s name and remember it',
    'Give a specific compliment to someone you don\'t know well',
    'Join a conversation between two people for 1 minute',
    'Chat with someone waiting for something',
    'Ask a stranger a genuine question about their day',
    // Level 3
    'Have a 3-minute conversation with a stranger',
    'Share a small personal detail about yourself with someone new',
    'Ask someone for advice on something small',
    'Compliment someone on something specific they did or said',
    'Start a conversation about a shared experience',
    'Ask someone about their interests or hobbies',
    'Tell someone something true about yourself that\'s slightly vulnerable',
    'Make someone laugh with genuine humor',
    'Follow up on something someone mentioned earlier',
    'Ask someone a question that shows you were listening',
    // Level 4
    'Have a 5-minute conversation with a stranger',
    'Attend a group activity and introduce yourself to 2+ people',
    'Ask someone a deeper question about their life',
    'Share something you\'re working on or interested in',
    'Ask someone for their contact info or social media',
    'Be genuinely curious and ask follow-up questions',
    'Admit something you don\'t know to someone new',
    'Find common ground with someone and explore it',
    'Have a conversation about something that matters to you',
    'Listen more than you talk in a conversation',
    // Level 5
    'Attend a group activity and introduce yourself to 3+ people',
    'Ask someone for advice on something real',
    'Have a 10+ minute conversation with someone new',
    'Share a goal or dream with someone',
    'Ask someone about their values or what matters to them',
    'Propose getting coffee, lunch, or hanging out',
    'Be vulnerable about a challenge you\'re facing',
    'Initiate plans with someone you just met',
    'Have a conversation where you\'re fully present and engaged',
    'Connect two people you know by introducing them',
    // Level 6
    'Attend a social event alone and stay 45+ min',
    'Lead a conversation or group activity',
    'Share something about yourself that feels slightly risky',
    'Ask someone about their struggles or challenges',
    'Open up about something you care deeply about',
    'Have a meaningful conversation with someone older or younger',
    'Navigate disagreement respectfully with someone',
    'Be the first to reach out after not talking for a while',
    'Ask someone for help or support with something',
    'Have a conversation that goes beyond surface level',
    // Level 7
    'Attend a meetup or group for something you\'re interested in',
    'Lead or speak up in a group setting',
    'Share a mistake you made and what you learned',
    'Have a conversation about feelings or emotions',
    'Propose a deeper friendship or connection with someone',
    'Ask someone for honest feedback about yourself',
    'Share something you\'re insecure about',
    'Have a conversation about dreams or future plans',
    'Admit when you\'re wrong or made a mistake',
    'Have a real conversation about mental health or struggles',
    // Level 8
    'Attend a new group or class and engage with people',
    'Have a conversation where you\'re fully vulnerable',
    'Share something deeply personal with someone new',
    'Ask someone for mentorship or guidance',
    'Be the voice in a group that others might fear to speak',
    'Have a conversation that challenges your thinking',
    'Express a need or boundary with someone',
    'Share your authentic self without a mask',
    'Have a conversation about disappointment or pain',
    'Encourage someone and be genuine about it',
    // Level 9
    'Start a conversation about something controversial respectfully',
    'Share a failure and how you grew from it',
    'Have a deep conversation with someone very different from you',
    'Express something you\'ve been holding back',
    'Be present for someone who\'s struggling',
    'Have a conversation that could deepen a relationship',
    'Share your values openly with someone new',
    'Ask someone about their worst fear and listen deeply',
    'Have a conversation where you fully listen without judgment',
    'Share what you\'re proud of without minimizing it',
    // Level 10
    'Have a conversation about what truly matters in life',
    'Share your story with someone new in a meaningful way',
    'Attend a group event where you don\'t know anyone and build real connections',
    'Have a conversation where you\'re completely authentic',
    'Ask someone how you can support them',
    'Share something you\'ve never told anyone before',
    'Have a conversation that could change a relationship',
    'Lead a group or facilitate meaningful conversation',
    'Be vulnerable in front of multiple people',
    'Have a conversation that leaves both of you feeling seen',
  ];

  const virtual = [
    // Level 1
    'Text someone you haven\'t talked to in 3+ months',
    'Like or comment on a friend\'s social post',
    'Send a meme or funny thing to someone',
    'Message an old acquaintance to say hi',
    'React to Instagram story with more than emoji',
    'Send someone a photo or update about your day',
    'Ask a friend how their week has been',
    'Respond to someone\'s message with genuine interest',
    'Send a funny video or article to someone',
    'Write someone a message saying you miss them',
    // Level 2
    'Send a voice message instead of text',
    'Video call someone and initiate it yourself',
    'Share something you\'ve been thinking about',
    'Reach out to someone after a conflict',
    'Post something genuine on social media',
    'Start a group chat with people you\'re less close to',
    'Ask someone for their honest feedback',
    'Send someone an encouraging message',
    'Share a photo and talk about what\'s really going on',
    'Message someone telling them why you appreciate them',
    // Level 3
    'Call someone instead of texting',
    'Share a creative work or writing with someone',
    'Have a real conversation about feelings',
    'Post something that reveals a real part of you',
    'Reach out to someone you admire or look up to',
    'Have a deeper conversation about values or dreams',
    'Be vulnerable in a message about something you care about',
    'Send a long, genuine message to someone',
    'Have a video call where you\'re fully present',
    'Message someone about something that scared you',
    // Level 4
    'Share a mistake or failure with someone online',
    'Have a meaningful text conversation that goes deep',
    'Message someone telling them something true about how you feel',
    'Reach out to someone you hurt and apologize genuinely',
    'Share a goal or dream with someone publicly or privately',
    'Have a voice or video conversation about something real',
    'Message someone asking for support or help',
    'Share something insecure or vulnerable in a group chat',
    'Have a conversation online that\'s more real than usual',
    'Send someone a message saying what they mean to you',
    // Level 5
    'Post something about a struggle you\'re facing',
    'Have a video call where you talk about feelings',
    'Message someone about mental health or emotions',
    'Reach out to someone and ask about their real life',
    'Share a photo that shows your real self',
    'Have a conversation online that\'s vulnerable and honest',
    'Message someone telling them an honest truth',
    'Post about something you\'re learning or growing through',
    'Have a long voice or video call with someone',
    'Share something about yourself that feels risky online',
    // Level 6
    'Go live or share video content of yourself',
    'Have a real conversation online about struggles',
    'Post something that reveals insecurity or challenge',
    'Message someone about something you\'re scared of',
    'Have a video call where you\'re fully authentic',
    'Share your real thoughts in a group chat',
    'Message someone about disappointment or pain',
    'Post about a failure and what you learned',
    'Have a conversation online that deepens a relationship',
    'Share something deeply personal in a message',
    // Level 7
    'Post about mental health or emotional struggles',
    'Have a conversation online about fear or anxiety',
    'Message someone with complete honesty about something hard',
    'Share your story or journey online',
    'Have a video call that\'s emotionally vulnerable',
    'Post something that challenges social norms',
    'Message someone asking for real support',
    'Have a group conversation online that\'s genuine',
    'Share your values or beliefs in a post',
    'Message someone telling them something you\'ve withheld',
    // Level 8
    'Post something that could be judged or misunderstood',
    'Have a conversation online about your real struggles',
    'Message someone your biggest fear or insecurity',
    'Share part of your story that\'s painful',
    'Have a vulnerable video call with someone new',
    'Post about something that matters deeply to you',
    'Message a group about something real and hard',
    'Have a conversation that could change a relationship',
    'Share something you\'ve never said online before',
    'Message someone with complete vulnerability',
    // Level 9
    'Post something deeply personal and authentic',
    'Have a conversation online about what truly matters',
    'Message someone saying how they\'ve impacted you',
    'Share your real self in a post without filter',
    'Have a meaningful conversation online with someone new',
    'Post about a transformation or growth journey',
    'Message someone about your deepest values',
    'Have a conversation that feels completely real',
    'Share something that required courage to post',
    'Message multiple people telling them what they mean to you',
    // Level 10
    'Post your whole authentic self online',
    'Have a conversation online that changes both of you',
    'Share something that could have major impact',
    'Message someone your biggest dream or vision',
    'Have a vulnerable conversation with someone you admire',
    'Post about something that scares you greatly',
    'Message someone telling them your real needs',
    'Have a conversation that deepens into real connection',
    'Share your journey including the hardest parts',
    'Message someone leaving a lasting, meaningful impression',
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
