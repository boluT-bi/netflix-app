import TMDB_interface from '../js/tmdbApiInterface.js';
import {genericEvtCurry} from '../js/eventControls.js';
import RowGen,{PageGen,MF,recommendSkel,heapSort,unsortedMatrix} from './rowGen.js';
import { createTombStone,matrixToLib } from './auxiliaryFunctions.js';
import ClientData from './clientDataControls.js';

function shuffle(dta)
{
    let currIndex = dta.length,
        randomIndex;
    while(currIndex != 0){
        randomIndex = Math.floor(Math.random()*currIndex);
        currIndex --;
        [dta[currIndex],dta[randomIndex]] = [dta[randomIndex],dta[currIndex]];
    }
    return dta;
}

function concatDta(tvData,mvData)
{   
    const tvToArray = [];
    const mvToArray = [];
    if(!Array.isArray(tvData)){
        tvToArray.push(tvData);
        tvData = tvToArray;
    }
    if(!Array.isArray(mvData)){
        mvToArray.push(mvData);
        mvData = mvToArray;
    }
    
    return shuffle(tvData.concat(mvData));
}
function assignSearchType(dta,searchType)
{
    try{
        dta.map((x) =>{
        if(!x["media_type"]){
            x["search_type_code"] = searchType;
        }
        });
    }
    catch(e){
        return dta;
    }
    return dta;

   
    
}


const STORAGE_INSTANCE = new ClientData();
STORAGE_INSTANCE.initializeDataBase(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,null);
const SEARCH_TYPE = ['tv','movie'];
const TS_INSTANCE = new TMDB_interface(null,SEARCH_TYPE[Math.floor(Math.random()* SEARCH_TYPE.length)]);
const SEARCH_INSTANCE = new TMDB_interface();
const TS_DATA = await TS_INSTANCE.searchPopularTitles(null,1);
const RAND_ST = SEARCH_TYPE[Math.floor(Math.random()* SEARCH_TYPE.length)];
const P_NODE = document.getElementsByClassName('subContentOne').item(0);
const CURR_USER = document.getElementById('profile-user').value;
createTombStone(TS_INSTANCE.searchType,TS_DATA);

const page = new RowGen();
const recommendRow = new RowGen(20,null,RAND_ST,false);
page.generatePopularRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,RAND_ST,null,1,'Popular');
const genreList = page.generateGenreTags(5,RAND_ST);
page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[2],RAND_ST,null,1,genreList[2]);
const myListData = window.localStorage[`${document.getElementById('profile-user').value}`];

if(myListData){
    const myList = JSON.parse(myListData);
    if(Object.keys(myList['myList']['tv']).length){
        if(Object.keys(myList['myList']['tv']).length && Object.keys(myList['myList']['movie']).length){
            const TV_ID_DTA = await SEARCH_INSTANCE.searchById(myList['myList']['tv'], 'tv');
            const MV_ID_DTA =  await SEARCH_INSTANCE.searchById(myList['myList']['movie'], 'movie');
            const LABLED_TV_DTA = assignSearchType(TV_ID_DTA, 'tv');
            const LABLED_MV_DTA = assignSearchType(MV_ID_DTA, 'movie');
            const MASTER_MY_LIST_DTA = { "results" : []};
            MASTER_MY_LIST_DTA["results"] = concatDta(LABLED_TV_DTA,LABLED_MV_DTA); 
            const MY_LIST_PG = new RowGen(MASTER_MY_LIST_DTA["results"].length,'My List', 'row', true);

            MY_LIST_PG.generatePreLoadedData(P_NODE,CURR_USER,MASTER_MY_LIST_DTA["results"].length,MASTER_MY_LIST_DTA,'My List',true);

        }
        else{
            
        
            const myListRow = new RowGen(myList['myList']['tv'].length, 'My List', 'row', true);
            myListRow.generateRowById(document.getElementsByClassName('subContentOne').item(0),myList['myList']['tv'],'tv',document.getElementById('profile-user').value,'My List');

        }
    }
}

if(window.localStorage[`${document.getElementById('profile-user').value}`] && Object.keys(window.localStorage).length > 1){
    const matrixFactorized = new MF(STORAGE_INSTANCE.constructMatrix(document.getElementById('profile-user').value,RAND_ST));
    const factors = matrixFactorized.train();
    const recommendMatrix = matrixFactorized.fullMatrix(factors);


    const recommendHM = recommendSkel(window.localStorage,recommendMatrix,RAND_ST);

    const idMatrix = unsortedMatrix(recommendHM);

    heapSort(idMatrix);
    if(idMatrix.length >= 20){
        const top20recommendedLib = matrixToLib(idMatrix.slice(0,20));

        recommendRow.generateRowById(document.getElementsByClassName('subContentOne').item(0),Object.keys(top20recommendedLib),RAND_ST,document.getElementById('profile-user').value,`Top Picks For ${document.getElementById('profile-user').value}`);
    }
}
const top10tvData = await SEARCH_INSTANCE.searchTrending('tv');
recommendRow.generatePreLoadedData(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,10,top10tvData,'Top 10 Today',true,null,true);
//recommendRow.generateRowById(document.getElementsByClassName('subContentOne').item(0),Object.keys(top20recommendedLib),'tv',document.getElementById('profile-user').value, `Top picks for ${document.getElementById('profile-user').value}`);
page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[1],RAND_ST,null,1,genreList[1]);
page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[0],RAND_ST,null,1,genreList[0]);
page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[4],RAND_ST,null,1,genreList[4]);























