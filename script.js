const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav'); 
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function showContent(page)
{
    window.scrollTo({top: 0, behavior: 'instant'});
    if(page === 'results')
    {
        resultsNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');

    } else
    {
        resultsNav.classList.add('hidden');
        favouritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');


}
function createDOMNodes(page)
{
    const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
    // const currentArray = Object.values(favourites);
    currentArray.forEach((result) =>{
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link 
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card body <div>
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title <h5>
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // clickable Add To Favourites <p>
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        saveText.textContent = (page === 'results' ? 'Add To Favourites': 'Remove From Favourites');
        saveText.setAttribute('onclick', (page === 'results' ? `saveFavourite('${result.url}')`: `removeFavourite('${result.url}')`));
        // Card Text <p>
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        // Footer Card Date + copyright <small>
        const Footer = document.createElement('small');
        Footer.classList.add('text-muted');
        // Date <strong>
        const date = document.createElement('strong');
        date.textContent = result.date;
        // copyright
        const copyright = document.createElement('span');
        // copyright.textContent = (result.copyright?result.copyright: " ");
        const copyrightResult = result.copyright === undefined? '' : result.copyright;
        copyright.textContent = `${  copyrightResult}`;

        // Append
        Footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, Footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);

    });
}
function updateDOM(page)
{
    // Get Favourites from localStorage
    if (localStorage.getItem('nasaFavourites'))
    {
        favourites = JSON.parse(localStorage.getItem('nasaFavourites'));
        

    }
    imagesContainer.textContent='';
    createDOMNodes(page);
    showContent(page);

}

// get 10 images from NASA API

async function getNasaPictures() 
{
    // show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (error) {
        
    }
}
// Add result to Favourites
function saveFavourite(itemUrl)
{
    // Loop through Results Array to select Favourite
    resultsArray.forEach((item) =>
    {
        if(item.url.includes(itemUrl) && !favourites[itemUrl]) 
        {
            favourites[itemUrl] = item;
            console.log(JSON.stringify(favourites));
            // Show Save Confirmation 
            saveConfirmed.hidden = false;
            setTimeout(()=>
            {
                saveConfirmed.hidden = true;

            }, 2000);
            // Set Favourites in localstorage
            localStorage.setItem('nasaFavourites', JSON.stringify(favourites))
        }
    });
}

// Remove Item from Favourites

function removeFavourite(itemUrl)
{
    if (favourites[itemUrl])
    {
        delete favourites[itemUrl];
        // Set Favourites in localstorage
        localStorage.setItem('nasaFavourites', JSON.stringify(favourites))
        updateDOM('favourites');
    }
}

// on Load

getNasaPictures();