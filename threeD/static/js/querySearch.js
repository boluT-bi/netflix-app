import TMDB_interface from '../js/tmdbApiInterface.js';
import {genericEvtCurry} from '../js/eventControls.js';
import RowGen,{PageGen} from '../js/rowGen.js';


export default class Search extends TMDB_interface{

    constructor(searchType= 'tv')
    {
        super();
        this.searchType = searchType;
    }
    



    searchInputHandler(node)
    {
    
        var inputText = document.getElementsByClassName('searchInpt').item(0).value || '';
        
        var currUrl = window.location.href.slice(window.location.href.match(/\//).index + 2,);
        
        
        node.addEventListener('input',async function(e){

            let cachedText;
            switch(e.inputType){
                case 'insertText':
                    
                    inputText += `${e.data}`;
                    break;
                
                case 'deleteContentBackward':
                    cachedText = inputText.split('').length;
                    
                    inputText = inputText.slice(0,inputText.split('').length - 1);
                   
                    
                    
                    break;
            }
           
            document.getElementsByClassName('searchInpt').item(0).value = inputText;
            
            if(!inputText.length && cachedText === 1){
                
                if(!/search/.test(currUrl.slice(currUrl.match(/\//).index,))){
                   
                    history.replaceState({urlPath:currUrl.slice(currUrl.match(/\//).index,)},"",`${currUrl.slice(currUrl.match(/\//).index,)}`);
                    Search.fetchView(currUrl.slice(currUrl.match(/\//).index,)).then((data)=>{
                        document.getElementsByClassName('ref-ctnr').item(0).innerHTML = data;
                        Search.activateScript();
                    });

                }
                else{
                    
                    window.location.replace(window.location.href.slice(0,window.location.href.match(/(?<=[\d\.com\.org\.uk\.co.uk])\//).index)+ '/browse');
                }
            }
            else{
                
                history.pushState({urlPath: `/search?q=${inputText}`},"", `/search?q=${inputText}`);
                Search.fetchView(`/search?q=${inputText}`).then((data)=>{
                    document.getElementsByClassName('ref-ctnr').item(0).innerHTML = data;
                    Search.activateScript();
                });
                
                
                
                

                

            }

            

        });
        
    }
    static async querySearch(q)
    {
        const API_INSTANCE = new TMDB_interface();
        const data = API_INSTANCE.querySearch(q,'tv');

        return data;
        
    }
    static async fetchView(urlFrag)
    {
        const baseURI = window.location.href.slice(0,window.location.href.match(/(?<=[\d\.com\.org\.uk\.co.uk])\//).index);
        
        const promise = new Promise(function(resolve,reject){
            fetch(baseURI + urlFrag, {
                method: 'GET',
                mode: 'cors',
                credentials: 'same-origin',
                headers:{
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer'
                
            })
            .then((response)=>{
                return response.text();
            })
            .then((html)=>{
                
                resolve(html.slice(html.match(/<div class = 'subContentOne/).index,html.match(/<\/section/).index));
            })
            .catch(err=>reject(err));
        });
        return  promise

        
    }
    static activateScript()
    {
        
        const scriptArr = Array.prototype.slice.call(document.getElementsByTagName('script'));
        scriptArr.map((oldScript)=>{
            
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).map((attr)=>{

                if(attr.name === 'src'){
                    /\?/.test(attr.value) ? attr.value = attr.value.slice(0,attr.value.match(/\?/).index) + `?v=${Date.now()}`: attr.value = attr.value + `?v=${Date.now()}`;
                }
                newScript.setAttribute(attr.name,attr.value);
            });
            
            if(oldScript.parentElement.classList.contains('subContentOne')){
                oldScript.parentElement.replaceChild(newScript,oldScript);
            }

            
           

        });
    }
   
}



