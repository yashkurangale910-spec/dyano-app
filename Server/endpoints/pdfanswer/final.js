import OpenAI from 'openai';
import { writeFileSync } from 'fs';

let count = 0;

const imageGenerator = async (req, res) => {
  const question = req.body
  console.log(question.prompt)
  let ans;
  const openaiPrompt = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async function main() {
    const completion = await openaiPrompt.chat.completions.create({
      messages: [{ role: 'user', content: `Explain ${question.prompt} in 80 words` }],
      model: 'gpt-3.5-turbo',
    });

    ans = completion.choices[0].message.content
    console.log(ans)
  }

  main();


  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  // const prompt = question.prompt
  const prompt = `Generate a high quality image of ${question.prompt}`

  const result = await openai.images.generate({
    prompt,
    n: 1,
    size: "256x256"
  })

  const url = result.data[0].url

  const imgResult = await fetch(url)
  const blob = await imgResult.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())
  writeFileSync(`./img/finalImageOutput${count++}.png`, buffer)

  res.status(200).json({ data: ans, imgUrl: `http://localhost:3005/img/finalImageOutput${count - 1}.png` })
}

export default imageGenerator