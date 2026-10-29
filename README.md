# Glikify Backend

The chatbot behind [Glikify](https://glikify.com): website assistants for small businesses that answer customer questions 24/7 and send enquiries straight to the business.

## What it does

- Answers customer questions from each business's own FAQ list
- Captures leads (name and email) when it can't answer or when someone wants to book
- Emails every lead and saves it to a Google Sheet
- Runs one assistant per business, each with its own name and branding

## Adding the assistant to a website

Paste one line before the closing `</body>` tag:

```html
<script src="https://replify-backend.onrender.com/widget/widget.js" data-business-id="1" data-name="Gilly" data-color="#5B3BFF" defer></script>
```

Change `data-business-id`, `data-name` and `data-color` for each business.

## Settings

Private settings live in Render's Environment tab, never in this repository:

- `JWT_SECRET`: key for dashboard logins
- `LEADS_SHEET_URL`: Google Apps Script address that emails and records leads
- `BASE_URL`: the bot's public address
