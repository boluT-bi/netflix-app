import TMDB_interface from "./tmdbApiInterface.js";
import RowGen, { PageGen } from "./rowGen.js";
import { multiConcat } from "../js/auxiliaryFunctions.js";

if(!document.getElementById('searchDisplay')){
    const linkNode = document.createElement('link');
    linkNode.id = 'searchDisplay';
    linkNode.rel = 'stylesheet';
    linkNode.href = '/static/css/search.css';
    linkNode.type = 'text/css';
    document.getElementsByTagName('head').item(0).appendChild(linkNode);
}

const QUERY = document.getElementById('query').value;

const ACTIVE_PROFILE = document.getElementById('profile-user').value;
document.getElementsByClassName('searchInpt').item(0).classList.add('toggle');
document.getElementsByClassName('searchInpt').item(0).value = QUERY;

const API_INSTANCE = new TMDB_interface();
const ROWGEN_INSTANCE = new RowGen(20,null,'grid');
const PAGEGEN_INSTANCE = new PageGen();
function shuffle(arr)
{
    let currIndex = arr.length,
        randomIndex;
    while(currIndex != 0){
        randomIndex = Math.floor(Math.random()* currIndex);
        currIndex--;
        [arr[currIndex],arr[randomIndex]] = [arr[randomIndex],arr[currIndex]];

    }
    return arr;
}
function addSearchType(...args)
{
   const mapArr = [].slice.call(args);
   return mapArr.map((x)=>{
       x?.results.map((y)=>{
           if(!y["media_type"]){
               y["search_type_code"] =  x["search_type"];
           }
       });
   });
}
function personResults(dta,y)
{
    
    const x = { "results":[]};
    for(var i = 0; i<y; i++){
        
        for(var j = 0; j<dta[i]["known_for"].length; j++){
            
            x["results"].push(dta[i]["known_for"][j]);
        }
    }
    return x;
}
function constructData(...args)
{

}

export async function queryHandle(q)
{
   const personSearch = await API_INSTANCE.querySearch(q,'person');
   const data = await API_INSTANCE.querySearch(q,'tv');
   const mvSearch = await API_INSTANCE.querySearch(q, 'movie');

   if(data["results"].length && mvSearch["results"].length && personSearch["results"].length){
        
        data["search_type"] = 'tv';
        mvSearch["search_type"] = 'movie';

        addSearchType(data,mvSearch);
        let personArr;
        personSearch["results"].length < 5 ? personArr = personResults(personSearch["results"],personSearch["results"].length):personArr = personResults(personSearch["results"],5);
        const searchResults = data["results"].concat(mvSearch["results"],personArr["results"]);
        return searchResults;
   }
   if(data["results"].length && personSearch["results"].length){

        data["search_type"] = 'tv';
        addSearchType(data);
        const personArr = personResults(personSearch["results"], 5);
        const searchResults = data["results"].concat(personArr["results"]);
        return searchResults;

   }
   if(data["results"].length && mvSearch["results"].length){
        data["search_type"] = 'tv';
        mvSearch["search_type"] = 'movie';
        addSearchType(data,mvSearch);
        const searchResults = data["results"].concat(mvSearch["results"]);
        return searchResults


   }
   if(mvSearch["results"].length && personSearch["results"].length){
       mvSearch["search_type"] = 'movie';
       addSearchType(mvSearch);
       const personArr = personResults(personSearch["results"],5);
       const searchResults = mvSearch["results"].concat(personArr["results"]);
       return searchResults;
   }
    if(mvSearch["results"].length){
        mvSearch["search_type"] = 'movie';
        addSearchType(mvSearch);
        return mvSearch["results"];
    }   
    if(data["results"].length){
        data["search_type"]  = 'tv';
        addSearchType(data);
        return data["results"];
    }
    if(personSearch["results"].length){
        const personArr = personResults(personSearch["results"],personSearch["results"].length);
        return personArr["results"];
    }
   


    

   
  

    return;

}queryHandle(QUERY).then((data) =>{
    
    ROWGEN_INSTANCE.generatePreLoadGrid(document.getElementsByClassName('subContentOne').item(0),ACTIVE_PROFILE,data.length,data,true);

    
});

window.addEventListener('load', function(){
    document.getElementsByClassName('scrll-init').item(0).style.display = 'none';

},false)






