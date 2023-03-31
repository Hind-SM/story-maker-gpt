import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { Configuration, OpenAIApi } from "openai";
import "./App.css";

function App() {
  console.log("your openAI key is: ", import.meta.env.VITE_Open_AI_Key);
  //hooks
  const [story, setStory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOutput, setIsOutput] = useState(false);

  //openAI api
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_Open_AI_Key,
  });
  const openAIapi = new OpenAIApi(configuration);

  //handle keypress
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      generateStory();
    }
  };

  //handle keywords change
  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
  };

  //generate story
  const generateStory = async () => {
    setIsLoading(true);
    setIsOutput(false);
    const prompt = `Generate a children's story with the following keywords: ${keywords}, it should have a clear beginning, middle, end
      and should be around 100 or more words long. It must have a moral at the end.`;

    try {
      const response = await openAIapi.complete({
        engine: "davinci",
        prompt: prompt,
        maxTokens: 1000,
        topP: 1,
        stop: "\n\n",
      });

      const story = response.data.choices[0].text;
      setStory(story);
      setIsLoading(false);
      setIsOutput(true);
    } catch (error) {
      console.log(error);
    }
  };

  //generate output
  return (
    <div className="App">
      <h1>openAI Story Generator</h1>
      <input
        className="app-input"
        onChange={handleKeywordsChange}
        onKeyPress={handleKeyPress}
        value={keywords}
        placeholder="Type a list of 3 keywords for your story:"
      />
      <button className="app-button" onClick={generateStory}>
        Generate Story
      </button>
      {isLoading && <p>Generating Story...</p>}
      {isOutput && <p className="story-output">{story}</p>}
    </div>
  );
}

export default App;
