import { useState } from 'react'
import axios from 'axios'
import './App.css'

async function postImage({ image, description }) {
  const formData = new FormData();
  formData.append("image", image, image.name)
  formData.append("description", description)
  const result = await axios.post('/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return result.data
}

function App() {
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const [originalurl, setOriginalUrl] = useState("")

  const fileSelected = async event => {
    const file = event.target.files[0]
    if (file) {
      const result = await postImage({ image: file, description });
      setImages([result.image, ...images]);
      console.log(result.url);
      setOriginalUrl(result.url);
    }
  }

  const submit = async () => {
  
  }


  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
        <button type="submit">Submit</button>
      </form>

      {originalurl && <div>
        <img src={originalurl} alt="Uploaded Image" />
      </div>}
    </div>
  );
}

export default App;
