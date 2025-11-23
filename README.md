# promptbrary
Enhance simple prompts into professional ready to use prompts

test text

for my quick access :

git add .
git commit -m "Fix"
git push origin main

prompt: 

Now we will make a prompt enchancer feature work

for that we will write whole  logic for prompt enhancer feature in @prompt_enhance.js

so remove old dummy code that are related to prompt enhancer function from app.js which were created for testing ui

for now make a model selection dropdown disabled

we will use API key that user puts in api-key input to send the raw text and recieve enhanced prompt from ai model

we wil send raw text and his selected length like this so write a logic to send the users prompt (raw text) like this to the ai , if you need idea that how to write a code to call ai you can see it in file api_working_tested_code.md 

Enhance the following raw text into a professionally engineered AI prompt. Make it clear, structured, powerful, and optimized for high-quality outputs. Avoid extra added text i Just need prompt. Also rewrite it in the length I specify. Length needed: <selected length by user : Auto(normal)/ short(around 180) / medium(around 380-450) / long(around 600-700)>. Here is my raw text:<users Raw Text>

output

recieved output should be written into output area no other extra text