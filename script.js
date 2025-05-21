const inputBoxElement = document.querySelector('.input-box');
const submitBtn = document.querySelector('.submit-btn');
const newUrlField = document.querySelector('.new-url');
const availableData = document.querySelector('.stored-data');
const copyBtn = document.querySelector('.copy-icon');
let userName = 'user';
//URLs::::::::::;

const serverURL_d391 = `https://d391.onrender.com`;
const serverURL_mithai = `https://mithai-0t52.onrender.com`;
const localURL = `http://localhost:5000`;
let serverURL = '';
// :::::::::::::::::::::::::
connectToServer();





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
function setUserName() {

  const username = prompt('Enter your username');
  if(username.length > 0) {
      userName = username;
      document.querySelector('.user-name').innerHTML = userName;
    }
    document.querySelector('.user-name').innerHTML = userName;
    localStorage.setItem('username',userName);
    setConnectionURL(localStorage.getItem('username'));

}
function setConnectionURL(username) {
  if(username === 'd391') {
    serverURL = serverURL_d391;
    return;
  }else if(username === 'mithai') {
    serverURL = serverURL_mithai;
    return;
  }
  serverURL = serverURL_d391;
}
async function connectToServer() {

    if(!localStorage.getItem('username')) {
        setUserName();
    }
    userName = localStorage.getItem('username');
    if(userName.toLowerCase().includes('mithai')) {
        alert('welcome kuchipuchi ❤️');
    }
    setConnectionURL(userName);

    try {
    const response = await fetch(serverURL);
    document.getElementById('overlay').style.display = 'none';
    
    
    document.querySelector('.user-name').innerHTML = `( ${localStorage.getItem('username')} )`;
    
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    
    }
    return 1;

    } catch (error) {
      return 0;
    }
}

async function getShortURL(myURL) {

    const customURL = serverURL+`/userurl?url=${myURL}`;
    console.log(customURL);
    
    
    
    try {
        const response = await fetch(customURL);
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

document.querySelector('.delete-btn').addEventListener('click',()=>{
  if(localStorage.getItem('lol') !== '') {
    let userConfirmation = prompt('Delete All Urls? (y/n)');
    if(userConfirmation === 'y' || userConfirmation==='Y') {
      localStorage.removeItem('urlList');
      localStorage.removeItem('username');
      alert('all urls deleted successfully!');
      renderList();
      location.reload();
    }
    
  }else {
    alert('list is empty!');
  }
})