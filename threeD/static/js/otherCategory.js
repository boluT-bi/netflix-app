import RowGen, {PageGen} from '../js/rowGen.js';
import ClientData from '../js/clientDataControls.js';
import TMDB_interface from '../js/tmdbApiInterface.js';

import Search from './querySearch.js';

const SEARCH_CATEGORY = document.getElementById('search-cat').value;
const SEARCH_TYPE = document.getElementById('search-type').value;
const API_INSTANCE = new TMDB_interface();
const PAGE_INSTANCE = new PageGen();
document.getElementsByClassName('genre--title').item(0).firstElementChild.textContent = SEARCH_CATEGORY;
PAGE_INSTANCE.generatePopularPageGrid(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,SEARCH_TYPE,[1,10]);

