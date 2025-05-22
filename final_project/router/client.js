const axios = require('axios');
const { response } = require('express');

async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000/'); 
    console.log('Books List:', response.data.books);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

async function getBookByIsbn(isbn) {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(`Book details for ISBN ${isbn}:`, response.data.result);
        })
        .catch(error => {
            if(error.response){
                console.error(`Error ${error.response.status}:`, error.response.data.message);
            }
            else {
                console.error('Error:', error.message);
                }
        })
}

async function getBookByTitle(title) {
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            console.log(`Book details for title ${title}:`, response.data.result);
        })
        .catch(error => {
            if(error.response){
                console.error(`Error ${error.response.status}:`, error.response.data.message);
            }
            else {
                console.error('Error:', error.message);
                }
        })
}

async function getBookByAuthor(author) {
    axios.get(`http://localhost:5000/author/${author}`)
        .then(response => {
            console.log(`Book details for author ${author}:`, response.data.result);
        })
        .catch(error => {
            if(error.response){
                console.error(`Error ${error.response.status}:`, error.response.data.message);
            }
            else {
                console.error('Error:', error.message);
                }
        })
}

getBookByAuthor('Chinua Achebe')