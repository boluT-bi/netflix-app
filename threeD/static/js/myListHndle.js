import ClientData from "./clientDataControls.js";
import {PageGen} from "./rowGen.js";
import TMDB_interface from "./tmdbApiInterface.js";
import Search from "./querySearch.js";

if(window.localStorage[`${document.getElementById('profile-user').value}`]){
    const STORAGE_INSTANCE = new ClientData();
    const CURR_USER = document.getElementById('profile-user').value;
    const P_NODE = document.getElementsByClassName('subContentOne').item(0);
    const DTA_PRECURSOR = JSON.parse(window.localStorage[`${document.getElementById('profile-user').value}`]);

    const API_INSTANCE = new TMDB_interface();
    var MY_LIST_TV_DATA = DTA_PRECURSOR['myList']['tv'];
    var MY_LIST_MV_DATA = DTA_PRECURSOR['myList']['movie'];
    const TV_ID_DTA = await API_INSTANCE.searchById(MY_LIST_TV_DATA, 'tv');
    const MV_ID_DTA =  await API_INSTANCE.searchById(MY_LIST_MV_DATA, 'movie');

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

    const LABLED_TV_DTA = assignSearchType(TV_ID_DTA, 'tv');
    const LABLED_MV_DTA = assignSearchType(MV_ID_DTA, 'movie');
    const MASTER_MY_LIST_DTA = concatDta(LABLED_TV_DTA,LABLED_MV_DTA);




    const MY_LIST_PG = new PageGen();

    MY_LIST_PG.preLoadDtaPage(P_NODE,CURR_USER,MASTER_MY_LIST_DTA.length,MASTER_MY_LIST_DTA);
}



