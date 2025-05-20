const inputBoxElement = document.querySelector('.input-box');
const submitBtn = document.querySelector('.submit-btn');
const newUrlField = document.querySelector('.new-url');
const availableData = document.querySelector('.stored-data');
const copyBtn = document.querySelector('.copy-icon');

function renderList() {
  availableData.innerHTML='';
  let storedList = JSON.parse(localStorage.getItem("urlList")) || [];
  //console.log(storedList);
  
  let data = '';
  storedList.forEach(obj =>{
      data = 
      `<div class="data">
        <div class="full-link">${obj.originalURL}</div>
        <div class="short-link">${obj.shortURL}</div>
      </div>
      `;
    availableData.innerHTML += data;
      
  })
  
}
renderList();
function storeData(originalURL, shortURL) {
  const urlObj = {
    originalURL: originalURL,
    shortURL: shortURL
  }
  let urlList = JSON.parse(localStorage.getItem("urlList")) || [];
  urlList.push(urlObj);
  localStorage.setItem("urlList",JSON.stringify(urlList));

}
async function connectToServer() {
    const serverURL = `https://d391.onrender.com`;
    const localURL = `http://localhost:5000/`;

    try {
    const response = await fetch(serverURL);
    document.getElementById('overlay').style.display = 'none';
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    
    }
    return 1;

  } catch (error) {
    return 0;
  }
}
connectToServer();
async function getShortURL(myURL) {

  const customURL = `https://d391.onrender.com/userurl?url=${myURL}`;

  const localURL = `http://localhost:5000/userurl?url=${myURL}`;
    
    const serverURL = customURL;
    try {
        const response = await fetch(serverURL);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    storeData(myURL,json.shortUrl);
    renderList();
    return json;
    

  } catch (error) {
    console.error(error.message);
  }
}
submitBtn.addEventListener('click', async()=>{

    const userURL = inputBoxElement.value;
    if(userURL!='') {
        const response = await getShortURL(userURL);
        inputBoxElement.value = '';
        newUrlField.style.visibility = 'visible';
        copyBtn.style.visibility = 'visible';
        console.log(response.shortUrl);
        newUrlField.innerHTML = response.shortUrl;
        
                
    }else {
        alert('input field in empty!');
    }
      
});

function showCopyText() {
    const copyMsgField = document.querySelector('.copy-msg');
    copyMsgField.innerHTML = `link copied successfully!`
    setTimeout(()=>{
      copyMsgField.innerHTML = ``;
    },2000);
}

function copyText() {
    const text = newUrlField.innerText;
        navigator.clipboard.writeText(text).then(() => {
        showCopyText();
    }).catch(err => {
        console.error("Failed to copy: ", err);
  });
}