    let page_div = document.querySelector('.bigDaddy');
    let main_div = document.querySelector('.main');
    let character_modal = document.getElementById("myModal");
    let close_modal_button = document.querySelector(".close");
    let avatar =  document.querySelector('img.avatar');
    let base_image =  'img/star.png';
    let first_page_url = 'https://swapi.dev/api/people/';
    let next_button = document.querySelector('#next');
    let previous_button = document.querySelector('#previous');
    let character = {
      name: {
        ID: 'name',
        NAME: 'Name'
      },
      gender: {
        ID: 'gender',
        NAME: 'Gender'
      },
      birth_year: {
        ID: 'birth_year',
        NAME: 'Birth year'
      },
      home_world: {
        ID: 'planet',
        NAME: 'Planet'
      },
      films: {
        ID: 'films',
        NAME: 'Films'
      },
      species: {
        ID: 'species',
        NAME: 'Species'
      }
    };


//////////////////////////////////////////////Characters_List////////////////////////////////////////////
class Characters {
  constructor() {
    this.data = null
    this.tableKeys = ['name', 'gender', 'birth_year', 'homeworld', 'films', 'species']
  }

  async getData(page) {
    let securePage = page.replace('http:', 'https:');
    let response = await fetch(securePage);
    this.data = await response.json();
    let countElements = this.data ? this.data['results'].length : 1;
    this.buildMainDiv(countElements);
    if (!this.data['next']) {
        next_button.setAttribute('disabled', 'disabled');
    } else if (!this.data['previous']) {
        previous_button.setAttribute('disabled', 'disabled');
    }
    return this.data
  }

  getPerson(name) {
    if (this.data) {
      let person = this.data['results'].filter(card => card.name === name)[0];
      let tableFields = [];
      for (const key of this.tableKeys) {
        tableFields.push(person[key]);
      }
      return tableFields
    }
  }

  fillPage(cards) {
    if (this.data) {
      for (let i = 0; i < this.data['results'].length; i++) {
        cards[i].innerText = this.data['results'][i].name;
      }
    }
  }

buildMainDiv(elem) {
    if (elem === 0) {
      return
    } else {
      let itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      let CardInner = document.createElement('div');
      CardInner.className = 'card-inner';
      let CardFront = document.createElement('div');
      let CardBack = document.createElement('div');
      CardFront.className = 'card-front';
      CardBack.className = 'card-back';
      CardInner.insertAdjacentElement('beforeend', CardFront);
      CardInner.insertAdjacentElement('beforeend', CardBack);
      itemDiv.insertAdjacentElement('afterbegin', CardInner);
      main_div.insertAdjacentElement('afterbegin', itemDiv);
      this.buildMainDiv(elem - 1);
    }
  }
}

////////////////////////////////Modal_Window//////////////////////////////////////////
class Character {
    constructor(name, gender, birthYear, homeWorld, films, species) {
      this.name = name
      this.gender = gender
      this.birthYear = birthYear
      this.homeWorld = homeWorld
      this.films = films
      this.species = species
      this.table = document.querySelector('table')
    }
  
    async getData(page) {
      let securePage = page.replace('http:', 'https:');
      let response = await fetch(securePage);
      return await response.json();
    }
  
    tableBody() {
      let tableBody = document.createElement('tbody');
      this.table.insertAdjacentElement('afterbegin', tableBody);
    }
  
    tableRow(id, trow, kwargs) {
      let tableRowElement = document.createElement('tr');
      tableRowElement.id = id;
      let tableRowHead = document.createElement('th');
      let tableRowValue = document.createElement('td');
      for (const [key, value] of Object.entries(kwargs)) {
        let keyS = key.split('_');
        if (keyS[0] === 'th') {
          tableRowHead.setAttribute(keyS[1], value.toString());
        } else {
          tableRowValue.setAttribute(keyS[1], value.toString());
        }
      }
      tableRowElement.insertAdjacentElement('beforeend', tableRowHead);
      if (trow) {
        tableRowElement.insertAdjacentElement('beforeend', tableRowValue);
      }
      return tableRowElement
    }
  
    createList(row) {
      let ul = document.createElement('ul');
      row.lastElementChild.insertAdjacentElement('afterbegin', ul);
      return ul
    }
  
    getName() {
      let tr = this.tableRow(character.name.ID, false, {th_scope: "row", th_colspan: "2"});
      tr.firstElementChild.innerHTML = this.name.toString();
      document.querySelector('tbody').insertAdjacentElement('beforeend', tr);
    }
  
    getGender() {
      let tr = this.tableRow(character.gender.ID, true, {th_scope: "row", tr_colspan: "2"});
      tr.firstElementChild.innerHTML = character.gender.NAME;
      tr.lastElementChild.innerHTML = this.gender.toString();
      document.querySelector('tbody').insertAdjacentElement('beforeend', tr);
    }
  
    getBirthYear() {
      let tr = this.tableRow(character.birth_year.ID, true, {th_scope: "row", tr_colspan: "2"});
      tr.firstElementChild.innerHTML = character.birth_year.NAME;
      tr.lastElementChild.innerHTML = this.birthYear.toString();
      document.querySelector('tbody').insertAdjacentElement('beforeend', tr);
    }
  
    async getHomeWorld() {
      let planet = await this.getData(this.homeWorld);
      let tr = this.tableRow(character.home_world.ID, true, {th_scope: "row", tr_colspan: "2"});
      tr.firstElementChild.innerHTML = character.home_world.NAME;
      tr.lastElementChild.innerHTML = planet.name;
      document.querySelector('tbody').insertAdjacentElement('beforeend', tr);
    }
  
    async getFilms() {
      let tr = this.tableRow(character.films.ID, true, {th_scope: "row", tr_colspan: "2"});
      tr.firstElementChild.innerHTML = character.films.NAME;
      if (this.films.length > 0) {
        let list = this.createList(tr);
        for (let film of this.films) {
          let data = await this.getData(film);
          let li = document.createElement('li');
          li.innerHTML = data.title;
          list.insertAdjacentElement('beforeend', li);
        }
      } else {
        tr.lastElementChild.innerHTML = 'No films';
      }
      document.querySelector('tbody').insertAdjacentElement('beforeend', tr);
    }
  
    async gerSpecies() {
      let tr = this.tableRow(character.species.ID, true, {th_scope: "row", tr_colspan: "2"});
      tr.firstElementChild.innerHTML = character.species.NAME;
      if (this.species.length > 0) {
        let list = this.createList(tr);
        for (let spec of this.species) {
          let data = await this.getData(spec);
          let li = document.createElement('li');
          li.innerHTML = data.name;
          list.insertAdjacentElement('beforeend', li);
        }
      } else {
        tr.lastElementChild.innerHTML = 'No species';
      }
      document.querySelector('tbody').insertAdjacentElement('beforeend', tr);
    }
  
    async fillTable() {
      this.tableBody();
      this.getName();
      this.getGender();
      this.getBirthYear();
      await this.getHomeWorld();
      await this.getFilms();
      await this.gerSpecies();
    }
  }
//////////////////////////////////////////////Main/////////////////////////////////////////////////


window.addEventListener('DOMContentLoaded', async () => {

    const characters = new Characters();
    let clickedCard;
  
    async function newPageList(page) {
      await characters.getData(page);
      characters.fillPage(document.querySelectorAll('div.card-front'));
      window.localStorage.setItem('page', page);
    }
  
    if (window.localStorage.page) {
      await newPageList(window.localStorage.page);
    } else {
      await newPageList(first_page_url);
    }
  
    async function fillModal(name) {
      let person = characters.getPerson(name);
      let character = new Character(...person);
      await character.fillTable();
    }
  
    async function clickButton(event) {
      if (event.target.className === 'card-front') {
        main_div.classList.add('disabled');
        let parentElem = event.target.parentElement;
        clickedCard = parentElem;
        let characterName = event.target.innerHTML;
        let backSide = event.target.nextElementSibling;
        backSide.style.backgroundImage = `url('img/${characterName.toLowerCase()}.png')`;
        avatar.setAttribute('src', `img/${characterName.toLowerCase()}.png`);
        avatar.onerror = () => {
          avatar.setAttribute('src', base_image);
          backSide.style.backgroundImage = `url('${base_image}')`;
        }
        avatar.style.display = 'block';
        await fillModal(event.target.innerHTML);
        character_modal.style.display = "block";
      }
    }
  
    function removeMain() {
      while (main_div.firstChild) {
        main_div.removeChild(main_div.lastChild);
      }
    }
  
    function animateMain() {
      main_div.animate([
          {opacity: 0.8},
          {opacity: 1}],
        {duration: 500});
    }
  
    async function nextPageMove(event) {
      if (!characters.data['previous']) {
        previous_button.removeAttribute('disabled');
      }
      event.target.setAttribute('disabled', 'disabled');
      animateMain();
      let nextPage = characters.data['next'];
      if (nextPage) {
        page_div.classList.add('disabled');
        removeMain();
        await newPageList(nextPage);
        page_div.classList.remove('disabled');
        if (characters.data['next']) {
          event.target.removeAttribute('disabled');
        }
      }
    }
  
    async function prevPageMove(event) {
      if (!characters.data['next']) {
        next_button.removeAttribute('disabled');
      }
      event.target.setAttribute('disabled', 'disabled');
      animateMain();
      let prevPage = characters.data['previous'];
      if (prevPage) {
        main_div.classList.add('disabled');
        removeMain();
        await newPageList(prevPage);
        page_div.classList.remove('disabled');
        if (characters.data['previous']) {
          event.target.removeAttribute('disabled');
        }
      }
    }
  
    function backToList() {
      let tbody = document.querySelector('tbody');
      character_modal.style.display = "none";
      tbody.remove();
      main_div.classList.remove('disabled');
    }
  
    main_div.addEventListener('click', clickButton);
    next_button.addEventListener('click', nextPageMove);
    previous_button.addEventListener('click', prevPageMove);
    close_modal_button.addEventListener('click', backToList);
  
    window.onclick = function(event) {
    if (event.target === character_modal) {
      backToList();
    }
  }
    window.onkeyup = function (event) {
      if (event.key === 'Escape' && document.getElementById("myModal").style.display === 'block') {
        backToList();
      }
    }
  
  })
  