import fetch from "node-fetch";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

// ---------------------
//   ENGLISH LOOKUP
// ---------------------
async function getEnglishWordData() {
  // Get a random English word
  const wordRes = await fetch("https://random-word-api.herokuapp.com/word");
  const [word] = await wordRes.json();

  // Get definition + synonyms + example
  const dictRes = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const dictData = await dictRes.json();

  const entry = dictData[0]?.meanings?.[0];

  return {
    word,
    definition:
      entry?.definitions?.[0]?.definition || "No definition available.",
    example: entry?.definitions?.[0]?.example || "No example available.",
    synonym:
      entry?.synonyms?.[0] || entry?.definitions?.[0]?.synonyms?.[0] || "None",
  };
}

// ---------------------
//   SPANISH LOOKUP
// ---------------------
async function getSpanishWordData() {
  // Random Spanish word
  const wordRes = await fetch(
    "https://random-word-api.herokuapp.com/word?lang=es"
  );
  const [word] = await wordRes.json();

  // Spanish definitions
  const dictRes = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/es/${word}`
  );
  const dictData = await dictRes.json();

  const entry = dictData[0]?.meanings?.[0];

  return {
    word,
    definition:
      entry?.definitions?.[0]?.definition || "No definition available.",
    example: entry?.definitions?.[0]?.example || "No example available.",
    synonym:
      entry?.synonyms?.[0] || entry?.definitions?.[0]?.synonyms?.[0] || "None",
  };
}

// ---------------------
//   SEND TO DISCORD
// ---------------------
async function sendToDiscord(message) {
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });
}

// ---------------------
//   MAIN MESSAGE BUILDER
// ---------------------
async function main() {
  const english = await getEnglishWordData();
  const spanish = await getSpanishWordData();

  const message = `
##**🇪🇸 Spanish Word Of The Day**
>>>**${spanish.word}:** ${spanish.definition} 
**Sinónimos:** ${spanish.synonym}
**Ejemplo:** ${spanish.example}

##**🇬🇧 English Word Of The Day**
>>>**${english.word}:** ${english.definition}
**Synonyms:** ${english.synonym}
**Usage:** ${english.example}
  `.trim();

  await sendToDiscord(message);
  console.log("Sent message to Discord:");
  console.log(message);
}

main().catch(console.error);
