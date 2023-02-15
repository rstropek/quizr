# Quizr

## Introduction

Sample application demonstrating various aspects of Cloudflare Workers in conjunction with Airtable.

## Notes

* Running the app: `npm start`
* Deploying the app: `npm run deploy`
* View logs: `npx wrangler tail cfquizr`

## Generate Quizzes With ChatGPT

```txt
Generate a quiz about the city Paris. The quiz must contain 5 questions about Paris. For each question, generate 4 answer options. Only one answer should be correct. Answer in CSV. The CSV should look like this:

city,question,answer1,answer2,answer3,answer4,correctAnswer
...

Put all strings in double quotes.
```
