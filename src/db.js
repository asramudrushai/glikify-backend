const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'replify.db');
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER,
  question TEXT,
  answer TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS chat_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER,
  widget_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER,
  name TEXT,
  email TEXT,
  chat_session_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// Seed demo business (ID 1)
const businessCount = db.prepare('SELECT COUNT(*) AS c FROM businesses').get().c;
if (businessCount === 0) {
  db.prepare("INSERT INTO businesses (id, name, email, password_hash) VALUES (1, 'Replify Demo Business', 'demo@replify.uk', '')").run();
}
const faqCount = db.prepare('SELECT COUNT(*) AS c FROM faqs WHERE business_id = 1').get().c;
if (faqCount === 0) {
  const insertFaq = db.prepare('INSERT INTO faqs (business_id, question, answer) VALUES (1, ?, ?)');
  insertFaq.run('What are your opening hours?', 'We are open Monday to Friday 9am to 5pm, and Saturday 10am to 2pm. Closed Sundays.');
  insertFaq.run('What services do you offer?', 'We offer AI-powered customer service chatbots for small businesses, including setup, FAQ training, and ongoing support.');
  insertFaq.run('How much does it cost? What are your prices?', 'Replify costs 200 pounds per month plus a 495 pound one-off setup fee, with a free 30-day trial. Half-price setup for our first 3 founding clients!');
  insertFaq.run('Where are you located? What is your address?', 'We are based in Derby, UK, and work with local small businesses across the area.');
  insertFaq.run('How do I contact you? What is your phone number or email?', 'You can reach us at hello.replify.uk@gmail.com and we will get back to you within one working day.');
}

// Seed Stable View cafe (ID 2)
const svCount = db.prepare('SELECT COUNT(*) AS c FROM businesses WHERE id = 2').get().c;
if (svCount === 0) {
  db.prepare("INSERT INTO businesses (id, name, email, password_hash) VALUES (2, 'Stable View', 'stableviewinfo@gmail.com', '')").run();
}
const svFaqCount = db.prepare('SELECT COUNT(*) AS c FROM faqs WHERE business_id = 2').get().c;
if (svFaqCount === 0) {
  const insertSv = db.prepare('INSERT INTO faqs (business_id, question, answer) VALUES (2, ?, ?)');
  insertSv.run('What are your opening hours? When are you open?', 'We are open Monday to Friday 9.30am to 4pm, and weekends 10am to 3pm.');
  insertSv.run('Are you dog friendly? Can I bring my dog?', 'Dogs are very welcome in our outdoor seating areas - the wooden pagoda or the picnic benches by the stables - and we even have a doggy menu! Unfortunately dogs are not allowed inside the cafe itself. In summer our Horse Box bar serves drinks outside too.');
  insertSv.run('Do I need to book a table? Can I make a reservation or booking?', 'For tables of 4 or less we run on a first come first served basis, so just pop in. For anything more than that, we recommend booking to avoid disappointment - pop your name and email below and leave your details and the team will get straight back to you to arrange it.');
  insertSv.run('Do you do afternoon tea? How much is it and can I get it to take away?', 'Yes! Our afternoon tea is 23.95 pounds per person, served beautifully in gorgeous china. We can also make up afternoon tea boxes to take away. It is very popular for celebrations, so please leave your name and email below and the team will get back to you to book it in.');
  insertSv.run('Do you host events, parties, baby showers, birthdays or weddings?', 'Yes! We love hosting celebrations - baby showers, birthdays, bridal afternoon teas and more, with a lovely upstairs space for private groups. Pop your name and email below and leave your details, and the team will get straight back to you to plan your event.');
  insertSv.run('Do you cater for dietary requirements? Vegetarian, vegan, gluten free or allergies?', 'Absolutely - we regularly cater for vegetarian, gluten free and various allergies, and always do our best to accommodate dietary needs. Just let us know when you visit or when booking.');
  insertSv.run('Where are you located? What is your address? Do you have parking?', 'You will find us at Spondon Road, Ilkeston DE7 4PQ - a lovely spot in the Derbyshire countryside with plenty of parking and beautiful views across the fields.');
  insertSv.run('What food do you serve? Do you do breakfast, lunch or brunch?', 'We serve award-winning coffee, freshly baked cakes, breakfast, brunch and lunch - including our famous Stable Breakfast and burgers on pretzel buns. Our seasonal menu uses fresh, locally sourced ingredients.');
  insertSv.run('Do you have local walks nearby?', 'Yes - we are surrounded by beautiful Derbyshire countryside and have walking maps available. A Baileys hot chocolate after a long walk is a favourite!');
  insertSv.run('How do I contact you? What is your phone number or email?', 'You can call us on 01332 677373 or email stableviewinfo@gmail.com. If you leave your name and email here, the team will get back to you as soon as there is a quiet moment.');
}

// Seed Ashbourne Road Dental (ID 3)
const drCount = db.prepare('SELECT COUNT(*) AS c FROM businesses WHERE id = 3').get().c;
if (drCount === 0) {
  db.prepare("INSERT INTO businesses (id, name, email, password_hash) VALUES (3, 'Ashbourne Road Dental', 'info@ashbourneroaddental.co.uk', '')").run();
}
const drFaqCount = db.prepare('SELECT COUNT(*) AS c FROM faqs WHERE business_id = 3').get().c;
if (drFaqCount === 0) {
  const insertDr = db.prepare('INSERT INTO faqs (business_id, question, answer) VALUES (3, ?, ?)');
  insertDr.run('What are your opening hours? When are you open?', 'We are open Monday to Thursday 8am to 5pm, Friday 8.30am to 5.30pm, and Saturday by appointment only. Closed Sundays.');
  insertDr.run('Are you taking on new patients? Can I register? Do you take NHS or private?', 'We are currently accepting new NHS patients for children, and we welcome new private patients of all ages. Pop your name and email below and leave your details, and our team will get straight back to you to talk through your options and get you registered.');
  insertDr.run('Do you do emergency appointments? I have toothache or a dental emergency', 'Yes, we offer emergency dental care. If it is urgent, please call us on 01332 362 211 so we can help you as quickly as possible. You can also leave your name and email below and the team will get straight back to you.');
  insertDr.run('Do you do teeth straightening, Invisalign or braces?', 'Yes! We offer teeth straightening including Invisalign and ClearCorrect clear aligners, as well as ceramic braces for a discreet way to straighten your teeth. Leave your name and email below and our team will get back to you to arrange a consultation.');
  insertDr.run('Do you do dental implants or replace missing teeth?', 'Yes, we provide dental implants including single tooth implants, All-on-4 and implant-retained dentures, using trusted Straumann implants to restore your smile. Pop your name and email below and leave your details, and the team will get straight back to you to arrange a consultation.');
  insertDr.run('Do you do cosmetic dentistry, teeth whitening, veneers or bonding?', 'Yes! Our cosmetic treatments include veneers, composite bonding, and professional teeth whitening with Enlighten and Pola. Leave your name and email below and our team will get back to you to talk through your options.');
  insertDr.run('Do you do facial aesthetics, Botox, wrinkle correction, fillers or Profhilo?', 'Yes, we offer facial aesthetics including wrinkle correction, Profhilo, lip fillers and Aqualyx. Pop your name and email below and leave your details, and our team will get straight back to you with more information.');
  insertDr.run('Do you do check ups, hygiene, root canal, extractions, dentures or bridges?', 'Yes, our general dentistry covers check-ups and preventative care, dental hygiene, root canal treatment, tooth extractions, dentures and dental bridges. Leave your name and email below and our team will get straight back to you to book you in.');
  insertDr.run('How do I book an appointment?', 'You can book online through our website, call us on 01332 362 211, or leave your name and email below and our team will get straight back to you to arrange a time that suits.');
  insertDr.run('Where are you located? What is your address? Do you have parking?', 'We are an independent dental clinic based on Ashbourne Road, serving patients across Derby and Derbyshire. Please call us on 01332 362 211 if you need directions.');
  insertDr.run('How do I contact you? What is your phone number or email?', 'You can call us on 01332 362 211 or email info@ashbourneroaddental.co.uk. You can also leave your name and email here and our team will get back to you.');
}

// Seed Cavendish Dental Care (ID 4)
const cvCount = db.prepare('SELECT COUNT(*) AS c FROM businesses WHERE id = 4').get().c;
if (cvCount === 0) {
  db.prepare("INSERT INTO businesses (id, name, email, password_hash) VALUES (4, 'Cavendish Dental Care', 'info@cavendishdentalderby.co.uk', '')").run();
}
const cvFaqCount = db.prepare('SELECT COUNT(*) AS c FROM faqs WHERE business_id = 4').get().c;
if (cvFaqCount === 0) {
  const insertCv = db.prepare('INSERT INTO faqs (business_id, question, answer) VALUES (4, ?, ?)');
  insertCv.run('What are your opening hours? When are you open?', 'We are open Monday 9am to 7pm, Tuesday 9am to 5.30pm, Wednesday 9am to 4pm, Thursday 9am to 5.30pm, and Friday 9am to 5pm. We are closed for lunch between 1pm and 2pm.');
  insertCv.run('Are you taking on new patients? Can I register?', 'Yes, we warmly welcome new private patients - we have been caring for Derby families for over 40 years. Pop your name and email below and leave your details, and our friendly team will get straight back to you to talk you through joining the practice.');
  insertCv.run('I am nervous about the dentist. Do you help nervous patients or offer sedation?', 'Absolutely - we are known for our calm and caring dentistry, and we offer sedation dentistry especially for nervous patients. Please leave your name and email below and our gentle team will get straight back to you to put your mind at ease.');
  insertCv.run('Do you do teeth straightening, Invisalign, Spark aligners or braces?', 'Yes! We offer teeth straightening including Invisalign and Spark clear aligners for a discreet way to straighten your smile. Leave your name and email below and our team will get back to you to arrange a consultation.');
  insertCv.run('Do you do dental implants or replace missing teeth?', 'Yes, we provide dental implants to replace missing teeth and restore your smile, and we offer a Same Day Smile service. Pop your name and email below and leave your details, and our team will get straight back to you to arrange a consultation.');
  insertCv.run('Do you do cosmetic dentistry, teeth whitening, veneers, bonding or a smile makeover?', 'Yes! Our cosmetic treatments include composite bonding and smile makeovers, veneers and professional teeth whitening. Leave your name and email below and our team will get back to you to talk through your options.');
  insertCv.run('Do you see children? Do you do childrens dentistry?', 'Yes, we welcome children and offer childrens dentistry in our calm, friendly practice. Pop your name and email below and leave your details, and our team will get straight back to you.');
  insertCv.run('Do you offer finance or payment plans?', 'Yes, we offer finance options through Chrysalis Finance to help spread the cost of treatment. Leave your name and email below and our team will get straight back to you with the details.');
  insertCv.run('Do you have a hygienist? Do you do hygiene appointments?', 'Yes, we have a dental hygienist for professional cleaning and gum health. Please leave your name and email below and our team will get back to you to book you in.');
  insertCv.run('Where are you located? What is your address? Do you have parking?', 'You will find us at 13-15 Derby Lane, Cavendish, Derby DE23 8UB. Please call us on 01332 764997 if you need directions.');
  insertCv.run('How do I contact you or book? What is your phone number or email?', 'You can book online through our website, call us on 01332 764997, or email info@cavendishdentalderby.co.uk. You can also leave your name and email here and our team will get back to you.');
}

// Seed Charming Smiles Derby (ID 5)
const csCount = db.prepare('SELECT COUNT(*) AS c FROM businesses WHERE id = 5').get().c;
if (csCount === 0) {
  db.prepare("INSERT INTO businesses (id, name, email, password_hash) VALUES (5, 'Charming Smiles Derby', 'info@charmingsmiles.co.uk', '')").run();
}
const csFaqCount = db.prepare('SELECT COUNT(*) AS c FROM faqs WHERE business_id = 5').get().c;
if (csFaqCount === 0) {
  const insertCs = db.prepare('INSERT INTO faqs (business_id, question, answer) VALUES (5, ?, ?)');
  insertCs.run('What are your opening hours? When are you open?', 'We are open Monday to Friday 8.30am to 5.30pm, and Saturday 9am to 1pm by appointment only. Closed Sundays. For out-of-hours emergencies please call 111.');
  insertCs.run('Are you taking on new patients? Can I register?', 'Yes, we welcome new private patients and would love to help. Every great smile starts with a conversation - pop your name and email below and leave your details, and our friendly team will get straight back to you to talk you through joining.');
  insertCs.run('Do you do emergency appointments? I have toothache or a dental emergency', 'Yes, we offer emergency dental care for pain, swelling, broken teeth or trauma, and aim to relieve discomfort quickly. Please call us on 01332 571606, or for out-of-hours emergencies call 111. You can also leave your name and email below and we will contact you as soon as possible.');
  insertCs.run('Do you do teeth straightening, braces or invisible braces?', 'Yes! We offer orthodontics including fixed braces and invisible clear aligner braces to straighten your teeth discreetly. Leave your name and email below and our team will get back to you to arrange a consultation.');
  insertCs.run('Do you do dental implants, bridges or dentures?', 'Yes, we replace missing teeth with dental implants, bridges and custom dentures - including lightweight titanium frame and flexible Valplast options. Pop your name and email below and leave your details, and our team will get straight back to you.');
  insertCs.run('Do you do cosmetic dentistry, teeth whitening, veneers or bonding?', 'Yes! Our cosmetic treatments include composite bonding, porcelain veneers and professional teeth whitening. Leave your name and email below and our team will get back to you to talk through your options.');
  insertCs.run('Do you do facial aesthetics?', 'Yes, we offer subtle facial aesthetic treatments to soften fine lines and enhance facial harmony, always tailored for a natural look. Pop your name and email below and leave your details, and our team will get straight back to you.');
  insertCs.run('Do you do check ups, hygiene, airflow, fillings, crowns or root canal?', 'Yes, our general and restorative dentistry covers family check-ups, hygiene and airflow cleaning, white fillings, crowns, inlays and onlays, and root canal treatment. Leave your name and email below and our team will get straight back to you to book you in.');
  insertCs.run('Where are you located? What is your address? Do you have parking?', 'You will find us at 1089 London Road, Derby DE24 8PZ, in the heart of Alvaston. Please call us on 01332 571606 if you need directions.');
  insertCs.run('How do I contact you or book? What is your phone number or email?', 'You can call us on 01332 571606 or email info@charmingsmiles.co.uk. You can also leave your name and email here and our team will get back to you.');
}

// Seed Castle Donington Dental Care (ID 6)
const cdCount = db.prepare('SELECT COUNT(*) AS c FROM businesses WHERE id = 6').get().c;
if (cdCount === 0) {
  db.prepare("INSERT INTO businesses (id, name, email, password_hash) VALUES (6, 'Castle Donington Dental Care', 'info@castledoningtondental.co.uk', '')").run();
}
const cdFaqCount = db.prepare('SELECT COUNT(*) AS c FROM faqs WHERE business_id = 6').get().c;
if (cdFaqCount === 0) {
  const insertCd = db.prepare('INSERT INTO faqs (business_id, question, answer) VALUES (6, ?, ?)');
  insertCd.run('What are your opening hours? When are you open?', 'We are open Monday 9am to 7pm, Tuesday and Wednesday 9am to 5pm, Thursday 9am to 7pm, and Friday 9am to 5pm. We are closed for lunch between 1pm and 2pm.');
  insertCd.run('Are you taking on new patients? Can I register?', 'Yes, we welcome new private patients and would be delighted to have you - we have cared for generations of local families for over 30 years. Pop your name and email below and leave your details, and our friendly team will get straight back to you to talk you through joining.');
  insertCd.run('I am nervous about the dentist. Do you help nervous patients?', 'Absolutely - we pride ourselves on a friendly, relaxed environment and are very experienced with nervous patients. Please leave your name and email below and our caring team will get straight back to you to put your mind at ease.');
  insertCd.run('Do you do dental implants or replace missing teeth?', 'Yes, our qualified implantologist offers a wide range of dental implant services including single tooth replacement, full arch restorations, implant bridges and implant-retained dentures. Pop your name and email below and leave your details, and our team will get straight back to you to arrange a consultation.');
  insertCd.run('Do you do teeth straightening, braces or invisible braces?', 'Yes! We offer teeth straightening from short-term fixed braces to invisible braces to transform your smile. Leave your name and email below and our team will get back to you to arrange a consultation.');
  insertCd.run('Do you do cosmetic dentistry, teeth whitening, veneers or bonding?', 'Yes! Our cosmetic treatments include veneers, composite bonding, tooth whitening, cosmetic crowns and space closure. Leave your name and email below and our team will get back to you to talk through your options.');
  insertCd.run('Do you do facial aesthetics or Botox?', 'Yes, we offer facial aesthetics including Botox to soften fine lines and wrinkles and restore a fresher, younger look. Pop your name and email below and leave your details, and our team will get straight back to you.');
  insertCd.run('Do you have a dental plan or membership?', 'Yes, we offer dental plans that give you generous discounts on treatments while you budget for your annual check-ups and hygiene appointments. Leave your name and email below and our team will get straight back to you with the details.');
  insertCd.run('Do you do check ups, hygiene, fillings, root canal or gum treatment?', 'Yes, our general dentistry covers check-ups, fillings, root canal treatment, extractions, and gum disease treatment and prevention, plus thorough hygiene appointments. Leave your name and email below and our team will get straight back to you to book you in.');
  insertCd.run('Do you accept referrals?', 'Yes, we accept dental referrals for a number of treatments. Please leave your name and email below and our team will get straight back to you with more information.');
  insertCd.run('Where are you located? What is your address?', 'You will find us at 8 Borough Street, Castle Donington, Derby DE74 2LA. Please call us on 01332 810233 if you need directions.');
  insertCd.run('How do I contact you or book? What is your phone number or email?', 'You can call us on 01332 810233 or email info@castledoningtondental.co.uk. You can also leave your name and email here and our team will get back to you.');
}

/**
 * Executes a SQL statement against the local SQLite database.
 * SELECT statements return an array of rows; other statements return an empty array.
 */
function query(sql) {
  try {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return db.prepare(sql).all();
    }
    db.prepare(sql).run();
    return [];
  } catch (error) {
    console.error('Database query error:', error.message);
    console.error('SQL:', sql);
    throw error;
  }
}

module.exports = { query };
