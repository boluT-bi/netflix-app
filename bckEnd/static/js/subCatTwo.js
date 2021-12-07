import RowGen,{PageGen,MF,heapSort,recommendSkel,unsortedMatrix} from '../js/rowGen.js';
import {displayFormat, genericEvtCurry, changePrmtr, dropDownConfig } from '../js/eventControls.js';
import ClientData from '../js/clientDataControls.js';

import {matrixToLib,createTombStone,nthChild, genreListFunctionalization} from '../js/auxiliaryFunctions.js';
import Search from '../js/querySearch.js';
import TMDB_interface from '../js/tmdbApiInterface.js';

const dataConfig = new ClientData();
dataConfig.initializeDataBase(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,'movie');
genreListFunctionalization();
const genreDropDown = genericEvtCurry(document.getElementsByClassName('subContent--genreDropdown').item(0),'click',dropDownConfig,document.getElementsByClassName('subContent--genreDropdown').item(0),30,document.getElementsByClassName('subContent--genreList').item(0));

const searchPop = new TMDB_interface(null,'movie');
const data = await searchPop.searchPopularTitles(null,1);
createTombStone('movie',data);
const page = new RowGen();
const recommendRow = new RowGen(20,null,'movie',false);
page.generatePopularRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,'movie',null,1,'Popular');
const genreList = page.generateGenreTags(5,'movie');
page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[0],'movie',null,1,genreList[0]);
const myListData = window.localStorage[`${document.getElementById('profile-user').value}`];
if(myListData){
    const myList = JSON.parse(myListData);
    if(Object.keys(myList['myList']['movie']).length){
    
        const myListRow = new RowGen(myList['myList']['movie'].length);
        myListRow.generateRowById(document.getElementsByClassName('subContentOne').item(0),myList['myList']['movie'],'movie',document.getElementById('profile-user').value,'My List');
    }
}


if(window.localStorage[`${document.getElementById('profile-user').value}`] && Object.keys(window.localStorage).length > 1){
    const matrixFactorized = new MF(dataConfig.constructMatrix(document.getElementById('profile-user').value,'movie'));
    const factors = matrixFactorized.train();
    const recommendMatrix = matrixFactorized.fullMatrix(factors);


    const recommendHM = recommendSkel(window.localStorage,recommendMatrix,'movie');

    const idMatrix = unsortedMatrix(recommendHM);

    heapSort(idMatrix);
    if(idMatrix.length >= 20){
        const top20recommendedLib = matrixToLib(idMatrix.slice(0,20));

        recommendRow.generateRowById(document.getElementsByClassName('subContentOne').item(0),Object.keys(top20recommendedLib),'movie',document.getElementById('profile-user').value,`Top Picks For ${document.getElementById('profile-user').value}`);
    }
}


//recommendRow.generateRowById(document.getElementsByClassName('subContentOne').item(0),Object.keys(top20recommendedLib),'movie',document.getElementById('profile-user').value, `Top picks for ${document.getElementById('profile-user').value}`);
page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[1],'movie',null,2,genreList[1]);
page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[2],'movie',null,3,genreList[2]);
page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[3],'movie',null,4,genreList[3]);






document.getElementsByClassName('viewHndle-prmtrs').item(0).addEventListener('click', viewPrmtrToggle);




const displayChangeHndleRow = genericEvtCurry(document.getElementsByClassName('rowView-Hndle').item(0),'click',displayFormat, document.getElementsByClassName('rowView-Hndle').item(0), 'movie');

const displayChangeHndleGrid = genericEvtCurry(document.getElementsByClassName('gridView-Hndle').item(0), 'click', displayFormat,document.getElementsByClassName('gridView-Hndle').item(0),'movie');


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
    evtLib[`parameterHandle_${y}`] = genericEvtCurry(x,'click',changePrmtr,x,'movie');
})