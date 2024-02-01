const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // TODO: Clear the results pane before you run a new search
  document.querySelector('#resultsImageContainer').innerHTML = '';
  document.querySelector('.suggestions ul').innerHTML = '';

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  let query = `${bing_api_endpoint}?q=${document.querySelector('.search input').value}&count=10`;

  let request = new XMLHttpRequest();

  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.open('GET', query);
  request.setRequestHeader('Ocp-Apim-Subscription-Key', bing_api_key);

  request.onload = function() {
    let data = JSON.parse(this.responseText);
    let imgs = data.value;
    imgs.forEach(image => {
      let img = document.createElement('img');
      img.onclick = function() {
        let img = document.createElement('img');
        img.src = image.contentUrl;
        document.querySelector('#board').appendChild(img);
      }
      img.src = image.thumbnailUrl;
      document.querySelector('#resultsImageContainer').appendChild(img);
    });
    
    let suggested = data.relatedSearches.slice(0, 5); // display 5 suggested searches
    suggested.forEach(term => {
        let div = document.createElement('li');
        div.onclick = function() {
          document.querySelector('.search input').value = term.text;
          runSearch();
        }
        div.innerText = term.text;
        document.querySelector('.suggestions ul').appendChild(div);
    })
  }

  // TODO: Send the request
  request.send();

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
