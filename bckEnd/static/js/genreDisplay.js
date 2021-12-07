import TMDB_interface from "./tmdbApiInterface.js";
import RowGen, { MF,recommendSkel,unsortedMatrix,heapSort } from './rowGen.js'
import { createTombStone, genreListFunctionalization } from "./auxiliaryFunctions.js";
import { displayFormat, genericEvtCurry, changePrmtr, dropDownConfig } from "./eventControls.js";
import { nthChild,matrixToLib } from "./auxiliaryFunctions.js";
import ClientData from "./clientDataControls.js";

import Search from "./querySearch.js";

const INITIALIZE_DATA = new ClientData();
const SEARCH_TYPE = document.getElementById('search-type').value;
const GENRE_ID = document.getElementById('genre-id').value;
const ROWGEN_INSTANCE = new RowGen(20,null,SEARCH_TYPE,false);
const GENRE = ROWGEN_INSTANCE.reverseGenres[`${SEARCH_TYPE}`][`${GENRE_ID}`];
const API_INSTANCE = new TMDB_interface(null, SEARCH_TYPE);
const GENRE_DATA = await INITIALIZE_DATA.initializeGenreDatabase(SEARCH_TYPE,GENRE);

const TS_Data = await API_INSTANCE.searchTvByGenre(GENRE);

INITIALIZE_DATA.initializeDataBase(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,SEARCH_TYPE);
document.getElementsByClassName('genre--title').item(0).firstElementChild.textContent = GENRE;


createTombStone(SEARCH_TYPE,TS_Data);

if(GENRE_DATA[`${document.getElementById('profile-user').value}`] && Object.keys(GENRE_DATA[`${document.getElementById('profile-user').value}`]).length >= 5){
    const GENRE_MATRIX = INITIALIZE_DATA.constructDynamicDataMatrix(document.getElementById('profile-user').value,SEARCH_TYPE,GENRE_DATA);
    const MF_INSTANCE = new MF(GENRE_MATRIX);
    const TRAINED_FCTRS = MF_INSTANCE.train();
    const TRAINED_MTRX = MF_INSTANCE.fullMatrix(TRAINED_FCTRS);
    const recommendHM = recommendSkel(GENRE_DATA,TRAINED_MTRX,SEARCH_TYPE);
    

    const idMatrix = unsortedMatrix(recommendHM);
    
    heapSort(idMatrix);
    
    const top20recommendedLib = matrixToLib(idMatrix.slice(0,20));
    
    const row = new RowGen(Object.keys(GENRE_DATA[`${document.getElementById('profile-user').value}`]).length,null,'row',false);
    row.generateRowById(document.getElementsByClassName('subContentOne').item(0),Object.keys(top20recommendedLib),SEARCH_TYPE,document.getElementById('profile-user').value,`Top Picks For ${document.getElementById('profile-user').value}`);


}
ROWGEN_INSTANCE.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,GENRE,SEARCH_TYPE,[1,6]);
document.getElementsByClassName('viewHndle-prmtrs').item(0).addEventListener('click', viewPrmtrToggle);

const GridViewToggle = genericEvtCurry(document.getElementsByClassName('gridView-Hndle').item(0),'click', displayFormat, document.getElementsByClassName('gridView-Hndle').item(0),SEARCH_TYPE,GENRE);
const rowViewTggle = genericEvtCurry(document.getElementsByClassName('rowView-Hndle').item(0),'click', displayFormat, document.getElementsByClassName('rowView-Hndle').item(0),SEARCH_TYPE,GENRE);
function viewParameters(){
    const params = ['Suggestions for you','Year Released','A-Z','Z-A'];
    const currTextContent = nthChild(document.getElementsByClassName('viewHndle-optionPlchldr').item(0),1).textContent;
    
    if(document.getElementsByClassName('viewHndle-drpDwn').item(0).childNodes.length < 1){
        params.map((x) =>{ 
            if(x.toUpperCase() != currTextContent){
                var pEl = document.createElement('p');
                pEl.textContent = x;
                document.getElementsByClassName('viewHndle-drpDwn').item(0).appendChild(pEl);
                

            }
            else{
                var pEl = document.createElement('p');
                pEl.textContent = x;
                pEl.style.display = 'none';
                document.getElementsByClassName('viewHndle-drpDwn').item(0).appendChild(pEl);
            }
            
        });
    }

}viewParameters();

const evtLib = {};
Array.prototype.slice.call(document.getElementsByClassName('viewHndle-drpDwn').item(0).childNodes).map((x,y)=>{
    evtLib[`parameterHandle_${y}`] = genericEvtCurry(x,'click',changePrmtr,x,SEARCH_TYPE,GENRE);
});
