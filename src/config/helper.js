import { Configuration, OpenAIApi } from "openai";

export const readerFile = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

export const askAI = async (prompt) => {
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: "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",
    })
  );
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = response.data.data[0].b64_json;
    return image;
  } catch (error) {
    console.error(error);
  }
};
