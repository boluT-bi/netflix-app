import RowGen,{PageGen} from "../js/rowGen.js";

import { genericEvtCurry } from "../js/eventControls.js";
import TMDB_interface from "../js/tmdbApiInterface.js";
import Search from "./querySearch.js";

var TEMPLATE_TAGS = ['New', 'Coming This Week', 'Top 10 Today', 'Worth The Wait', 'Coming Next Week'];
var CRITERIA_DICT = { 'Coming This Week':{ meetsCriteria:(x,y)=>{return x < y + 7 ? true:false;}, results:[]},
                      'Coming Next Week':{ meetsCriteria:(x,y)=>{return x >= y + 7 && x < y + 14? true:false;},results:[]},
                      'Worth The Wait':{meetsCriteria:(x,y)=>{return x >= y + 14 ? true:false;},results:[]} };



function concatenateData(data)
{
    const dataCopy = data[0]["results"]
    for(var i = 1; i < data.length; i++){
        dataCopy.concat(data[i]);
    }
    return dataCopy;
}
function shuffle(arr)
{
    let currIndex = arr.length,
        randomIndex;
    while(currIndex != 0){
        randomIndex = Math.floor(Math.random()*currIndex);
        currIndex--;
        [arr[currIndex],arr[randomIndex]] = [arr[randomIndex],arr[currIndex]];
    }
    return arr;
}

const api_instance = new TMDB_interface();
const tvData = await api_instance.searchNewReleases('tv');
const movieData = await api_instance.searchNewReleases('movie');
const top10tvData = await api_instance.searchTrending('tv');


async function mixData(tvData,movieData)
{
    
    
    tvData["results"].map(x => x['search_type_code'] = 'tv');
    movieData["results"].map((x)=>{ 
        x["search_type_code"] = 'movie';
        tvData["results"].push(x);
    });
   
    

    shuffle(tvData["results"]);
    return tvData;


}

async function extractCriteriaData(criterium,pageRange)
{
    
    const API_INSTANCE = new TMDB_interface();
    const movieData = await API_INSTANCE.searchUpcoming(pageRange);
    
   
    
    const currDateMiliSecs = new Date(Date.now());
    const currDate = currDateMiliSecs[Symbol.toPrimitive]('string').split(' ');
    const currDay = parseInt(currDate[2]);
    const massData = concatenateData(movieData);
    

    for(var i = 0; i < massData.length; i++){
        if(CRITERIA_DICT[`${criterium}`].meetsCriteria(parseInt(massData[i].release_date.split('-')[2]),currDay)){
            CRITERIA_DICT[`${criterium}`].results.push(massData[i]);
        }
       
    }
    return CRITERIA_DICT[`${criterium}`];
    
    

}
const data = await mixData(tvData,movieData);
const top10Data = await top10tvData;
const upcomingData_1 = await extractCriteriaData(TEMPLATE_TAGS[1],[1,26]);
const upcomingData_2 = await extractCriteriaData(TEMPLATE_TAGS[3],[1,26]);
const upcomingData_3 = await extractCriteriaData(TEMPLATE_TAGS[4],[1,26]);

const preLoadUpcomingDataGen = new RowGen(20,null,'row',false);

const preloadedDataGen = new RowGen(data["results"].length,TEMPLATE_TAGS[0],'row',false);
preloadedDataGen.generatePreLoadedData(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,data["results"].length,data,TEMPLATE_TAGS[0]);
preLoadUpcomingDataGen.generatePreLoadedData(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,upcomingData_1["results"].length,upcomingData_1,TEMPLATE_TAGS[1],false,'movie');
preLoadUpcomingDataGen.generatePreLoadedData(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,10,top10Data,TEMPLATE_TAGS[2],true,null,true);
preLoadUpcomingDataGen.generatePreLoadedData(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,upcomingData_2["results"].length,upcomingData_2,TEMPLATE_TAGS[3],false,'movie');
preLoadUpcomingDataGen.generatePreLoadedData(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,upcomingData_3["results"].length,upcomingData_3,TEMPLATE_TAGS[4],false,'movie');

