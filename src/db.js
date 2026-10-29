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
  db.prepare("INSERT INTO businesses (id, name, email, password_hash) VALUES (1, 'Glikify', 'demo@glikify.com', '')").run();
}
// Glikify's own FAQs (business 1): reloaded on every start so changes always take effect
db.prepare('DELETE FROM faqs WHERE business_id = 1').run();
db.prepare("UPDATE businesses SET name = 'Glikify', email = 'demo@glikify.com' WHERE id = 1").run();
{
  const insertFaq = db.prepare('INSERT INTO faqs (business_id, question, answer) VALUES (1, ?, ?)');
  insertFaq.run('Why called name named meaning mean who is gilly', 'I\'m Gilly, Glikify\'s own assistant. I answer questions about Glikify day or night, just like your own assistant would for your customers.');
  insertFaq.run('How long take takes time timescale quick quickly live ready weeks days', 'It depends on your business. Once Sara has seen your website, she\'ll let you know how soon your assistant can be live. Leave your details and she\'ll be in touch.');
  insertFaq.run('Price prices cost costs much pay fee fees monthly month setup pricing expensive charge', 'Glikify is 49 pounds a month plus a 199 pound one-off setup fee, with no contract, and every business gets a free 30-day trial.');
  insertFaq.run('Free trial try test demo before buying', 'Yes! Every business gets a free 30-day trial. Sara can also build you a free demo using your own website, so you can see it working first. Leave your details and she\'ll get started.');
  insertFaq.run('Founding offer discount deal half price cheaper special', 'Our first 3 founding clients keep the 49 pound monthly price for as long as they stay, even when prices go up. In return we ask for an honest review once your assistant has been running for a while.');
  insertFaq.run('Contract cancel cancellation stop leave tied commitment notice', 'There\'s no contract. You pay monthly and can cancel any time.');
  insertFaq.run('Opening hours open times available reply respond weekend', 'I\'m here 24/7 to answer questions. Sara reads every enquiry and replies within one working day.');
  insertFaq.run('Glikify services offer chatbot chatbots assistant explain help', 'Glikify puts a friendly AI assistant on your website. It answers your customers\' questions in your own words, day or night, and when someone wants a quote or a booking it takes their details and sends them straight to you.');
  insertFaq.run('Automate automating automation automated admin paperwork tasks jobs time saving save repetitive', 'As well as website assistants, Glikify helps small businesses automate the everyday jobs that eat up their time. Leave your details and tell Sara what you would like to automate, and she will let you know what is possible.');
  insertFaq.run('Technical install code setup set up computer skills difficult easy', 'No technical skills needed. Sara builds your assistant, checks every answer with you and adds it to your website for you. You just read the enquiries that come in.');
  insertFaq.run('Website wordpress wix squarespace shopify site existing compatible', 'It works on most websites. Sara checks yours first and adds it for you, so there\'s nothing for you to do.');
  insertFaq.run('Leads enquiries enquiry details customers customer messages capture missed', 'When a customer wants a quote, a booking or a callback, I take their name and email and send them straight to your inbox, so no enquiry gets missed.');
  insertFaq.run('Emergency emergencies urgent burst leak boiler callout', 'For emergencies, your assistant can give your phone number straight away, so urgent jobs reach you fast. Everything else gets their details taken for a callback.');
  insertFaq.run('Businesses business suit suitable plumbers trades dentists cafes salons industries electricians garage', 'Glikify suits small businesses that can\'t always answer the phone: plumbers and trades, dentists, cafes, salons, car dealers, estate agents and local services.');
  insertFaq.run('Answers words customise custom change update brand branding assistant called my business', 'Your assistant is named and branded for your business and answers in your own words. Sara writes the answers with you and you approve them before launch. Need a change later? Just ask.');
  insertFaq.run('Contact email phone number speak talk reach sara', 'You can reach Sara at hello.glikify@gmail.com, or leave your name and email here and she\'ll get back to you within one working day.');
  insertFaq.run('Located location address based derby area where', 'Glikify is based in Derby, UK, and works with small businesses.');
  insertFaq.run('Start started sign signup interested join book call ready buy', 'Great! Leave your details and Sara will be in touch to get your assistant set up.');
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

// Seed Pride Plumbing Services (ID 7)
const ppCount = db.prepare('SELECT COUNT(*) AS c FROM businesses WHERE id = 7').get().c;
if (ppCount === 0) {
  db.prepare("INSERT INTO businesses (id, name, email, password_hash) VALUES (7, 'Pride Plumbing Services', 'info@prideplumbingservices.co.uk', '')").run();
}
const ppFaqCount = db.prepare('SELECT COUNT(*) AS c FROM faqs WHERE business_id = 7').get().c;
if (ppFaqCount === 0) {
  const insertPp = db.prepare('INSERT INTO faqs (business_id, question, answer) VALUES (7, ?, ?)');
  insertPp.run('Do you do emergency callouts? I have a leak, burst pipe or no heating', 'Yes, we handle plumbing and heating emergencies like leaks, burst pipes, boiler breakdowns and no heating or hot water, and we aim to get to you as quickly as possible. For an urgent callout please call us on 01332 367070, or pop your name and email below and leave your details and we will get straight back to you.');
  insertPp.run('Do you install boilers? Do you do Gas or LPG boilers?', 'Yes! Our Gas Safe registered installers fit Gas and LPG boilers, including Vaillant boilers which come with a 10-year manufacturer warranty, tailored to your needs. Pop your name and email below and leave your details and we will get straight back to you to arrange a free quote.');
  insertPp.run('Do you service boilers or do gas safety certificates? I am a landlord', 'Yes, we service boilers, fires and unvented water cylinders on all makes and models, and provide Gas Safety Certificates for both landlords and homeowners. Leave your name and email below and we will get straight back to you to book you in.');
  insertPp.run('Do you fit bathrooms? Do you do bathroom design and installation?', 'Yes! We offer complete bathroom design and installation and will work with you every step of the way to bring your dream bathroom to life. Pop your name and email below and leave your details and we will get straight back to you to arrange a quote.');
  insertPp.run('Do you fit radiators, towel rails, pumps or valves?', 'Yes, we fit new and designer radiators, towel rails, pumps and motorised valves. Leave your name and email below and we will get straight back to you to arrange a quote.');
  insertPp.run('Can you find a fault or fix a breakdown or repair? My boiler or heating is not working', 'Yes, our engineers are trained to identify and fix faults with boilers, heating and plumbing systems. Please call us on 01332 367070 for anything urgent, or pop your name and email below and leave your details and we will get straight back to you.');
  insertPp.run('Do you do general plumbing? Taps, toilets, leaks, wastes - no job too small?', 'Absolutely - no job too small! We handle replacement toilet parts, taps, leaks on pipework, float valves, and bath and basin wastes. Pop your name and email below and leave your details and we will get straight back to you.');
  insertPp.run('Can I get a quote? How much will it cost?', 'We would be happy to give you a quote. Pop your name and email below and leave your details, and we will get straight back to you to arrange a free, no-obligation quote for your job.');
  insertPp.run('What areas do you cover? Do you cover Derby?', 'We are based in Derby and cover Derby and the surrounding areas. If you are unsure whether we cover your area, leave your name and email below and we will get straight back to you.');
  insertPp.run('How do I contact you or book? What is your phone number or address?', 'You can call us on 01332 367070, or find us at Pride Place, Caesar Street, Derby DE1 3RU. You can also leave your name and email here and we will get straight back to you.');
}

// BHG Motor Group demo (ID 10): reloaded on every start
if (db.prepare('SELECT COUNT(*) AS c FROM businesses WHERE id = 10').get().c === 0) {
  db.prepare("INSERT INTO businesses (id, name, email, password_hash) VALUES (10, 'BHG Motor Group', 'sales@bhgmotorgroup.co.uk', '')").run();
}
db.prepare('DELETE FROM faqs WHERE business_id = 10').run();
{
  const insertBhg = db.prepare('INSERT INTO faqs (business_id, question, answer) VALUES (10, ?, ?)');
  insertBhg.run('Electric electrics hybrid hybrids plug charging cars', 'Yes. We sell and service full electric and hybrid cars, and our technicians are experienced with alternative-fuel vehicles. Leave your details if you\'d like the team to help.');
  insertBhg.run('Parts part genuine spares sell supply', 'We supply genuine MG and Hyundai parts. Leave your details with your registration and the part you need.');
  insertBhg.run('Opening hours open times close closing sunday saturday weekend today', 'Both our sites keep the same hours. Sales: Monday to Friday 9am to 7pm, Saturday 9am to 5pm, Sunday 11am to 4pm. Servicing and MOTs: Monday to Friday 8:30am to 6pm, Saturday 8am to 12pm, closed Sunday.');
  insertBhg.run('Where located location address sites site bushey colney heath albans directions find', 'We have two sites in Hertfordshire. Bushey: 6-10 High Road, Bushey, WD23 1SE. Colney Heath: The Service Station, High Street, Colney Heath, St Albans, AL4 0NU.');
  insertBhg.run('Contact phone number call email ring telephone speak', 'Bushey: 0208 420 5100. Colney Heath, St Albans: 01727 827000. You can also email sales@bhgmotorgroup.co.uk.');
  insertBhg.run('Stock available model colour mileage particular specific looking', 'Our stock changes all the time, so the team can tell you what\'s in today. Leave your details and the car you\'re after, and we\'ll get straight back to you.');
  insertBhg.run('Cars sell used makes brands hyundai kia mitsubishi renault ssangyong kgm buy', 'We sell quality used cars from many makes, especially Hyundai, Kia, MG, KGM, Mitsubishi, Renault and SsangYong. You can browse all our stock on the Used Cars page. Looking for something specific? Leave your details and we\'ll help.');
  insertBhg.run('Finance monthly payments pcp hire purchase credit loan deposit afford', 'Yes, we offer finance. Bushey Heath Garage Ltd is authorised and regulated by the Financial Conduct Authority (FRN 673830). All finance is subject to status and income. Leave your details and the team will talk you through the options.');
  insertBhg.run('Part exchange partexchange trade swap worth value valuation', 'You can get a valuation using the Value My Car tool on our website. If you\'d like the team to look at your car, leave your details and your car\'s registration.');
  insertBhg.run('Service servicing serviced maintenance', 'Yes. We\'re a proud MG franchise, and our factory-trained technicians service MG and Hyundai cars using genuine parts. We also service all other makes. Leave your details and we\'ll get you booked in.');
  insertBhg.run('Book booking online appointment hyundai', 'Hyundai servicing can be booked online through the Book a Service link on our Aftersales page. Or leave your details and we\'ll book it for you.');
  insertBhg.run('MOT mots test testing due book booking', 'Yes, we carry out MOTs on all makes of vehicle. Leave your details with your registration and preferred date, and we\'ll get you booked in.');
  insertBhg.run('Repair repairs fix broken fault problem warning light noise', 'Yes, we carry out repairs on Hyundai, MG and other makes. Leave your details and tell us what\'s wrong, and the team will get back to you.');
  insertBhg.run('Long years history family business established franchise about', 'BHG Motor Group is a family business with over 50 years of trading, and a proud MG franchise.');
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
