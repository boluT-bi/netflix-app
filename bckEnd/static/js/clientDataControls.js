import {genericEvtCurry} from './eventControls.js';
import {nthParent} from './auxiliaryFunctions.js';
import TMDB_interface from './tmdbApiInterface.js';


export default class ClientData{




    static loadContent()
    {   
        
        

        
        
       
        let args = [].slice.call(arguments[0][0]);
        args[2] ?? (args[2] = 'mixed');
        if(!window.localStorage[`${args[1]}`]){

            window.localStorage.setItem(`${args[1]}`,JSON.stringify({'tv':{},'movie':{}, 'mixed':{}}));
           
        }
        
        
        
       
        
        
        
        
        const contentHashMap = JSON.parse(window.localStorage[`${args[1]}`]);
        if(!contentHashMap[`${args[2]}`]){
            contentHashMap[`${args[2]}`] = {};
        }
        const childNodes = [].slice.call(document.getElementsByClassName('prevObject'));
       
        if(!contentHashMap['isInMyList']){
            contentHashMap['isInMyList'] = {};
        }
        if(!contentHashMap['myList']){
            contentHashMap['myList'] = {'tv': [], 'movie':[]};
        }
        
        for(var i =0; i < childNodes.length; i++){
            
            if(childNodes[i].firstElementChild.id.split('#').length){
                if(contentHashMap[`${args[2]}`][`${childNodes[i].firstElementChild.id}`]){
                    delete contentHashMap[`${args[2]}`][`${childNodes[i].firstElementChild.id}`];
                   
                }
                continue;
                
            }
            
            if(contentHashMap[`${args[2]}`][`${childNodes[i].firstElementChild.id}`] == null){

                
                contentHashMap[`${args[2]}`][`${childNodes[i].firstElementChild.id}`] = 0;
            }
            
            

                    
                   
                
               
           
        }

        
        window.localStorage[`${args[1]}`] = JSON.stringify(contentHashMap);
    
    }    
    initializeDataBase(pNode,activeProfile,searchType = 'tv')
    {
      const data = genericEvtCurry(window,'load',ClientData.loadContent,pNode,activeProfile,searchType);
    

      

    }
    constructMatrix(activeProfile,searchType = 'tv')
    {
        
        const hashVersion = window.localStorage;
        const idLib = JSON.parse(window.localStorage[`${activeProfile}`]);
        
        const user_itemHMLength = Object.keys(idLib[`${searchType}`]).length;
        
        
       

        const dataStruct = ClientData.fillMatrix(hashVersion.length,user_itemHMLength, ()=> 0);
        
        
        for(var x = 0, keys = Object.keys(hashVersion), xx = keys.length;x < xx; x++){
            var subLib = JSON.parse(hashVersion[keys[x]]);

            try{
                for(var y = 0, subKeys = Object.keys(subLib[`${searchType}`]); y< user_itemHMLength; y++){

                    dataStruct[x][y] = subLib[`${searchType}`][subKeys[y]];
                    
                    
                    
                    
                    
                }
            }
            catch(e){
                continue;
            }
        }
        

        return dataStruct;
    }

    constructDynamicDataMatrix(activeProfile,searchType='tv',data)
    {
        
        let lengthArr = new Array(data.length);
        ClientData.fillArr(lengthArr, ()=>0);
        lengthArr.map((x,i)=>{
            lengthArr[i] = data[Object.keys(data)[i]].length;
        });
        ClientData.insertionSort(lengthArr);

        let emptMatrix = ClientData.fillMatrix(Object.keys(data).length,lengthArr[0], ()=> 0);
        for(var i = 0, keys = Object.keys(data); i < keys.length; i++){
            
            for(var j = 0, subKeys = Object.keys(data[keys[i]]); j< lengthArr[0] ; j ++){
                emptMatrix[i][j] = data[keys[i]][subKeys[j]];


            }
        }
        
        return emptMatrix;
    }
    static fillArr(arr , fill)
    {
        for(var i= 0; i < arr.length; i++){
            arr[i] = fill();
        }
        return arr;
    }
    async initializeGenreDatabase(searchType,genre)
    {
        
        const dataProfs = window.localStorage;
       
        const idData = {};
        
        const lengthArr = new Array(dataProfs.length);
        ClientData.fillArr(lengthArr,()=>0);
        lengthArr.map((x,i)=>{
            let idDict = JSON.parse(dataProfs[Object.keys(dataProfs)[i]]);
            
            lengthArr[i] = Object.keys(idDict[`${searchType}`]).length;
        });
        
    
        const lengthArr_o = ClientData.insertionSort(lengthArr);
      

        const searchInstance = new TMDB_interface(null,searchType);
        const dataArr = new Array(dataProfs.length);
        ClientData.fillArr(dataArr,()=>0);
        dataArr.forEach((x,i)=>{
            dataArr[i] = JSON.parse(dataProfs[Object.keys(dataProfs)[i]]);
        });
        
       
        const data = await Promise.all(dataArr.map((x) =>{
            return searchInstance.searchById(Object.keys(x[`${searchType}`]).slice(0,lengthArr_o[0]));
        }));
       
        
        
        
        for(var i = 0; i < data.length; i++){
            
            for(var y = 0; y < data[i].length; y++){
                try{
                   
                    for(var j = 0; j < data[i][y].genres.length; j++){

                        if(data[i][y].genres[j]['name']=== genre){
                            
                            if(!idData[`${Object.keys(dataProfs)[i]}`]){
                                idData[`${Object.keys(dataProfs)[i]}`] = {};
                            }
                            let subLib = JSON.parse(dataProfs[Object.keys(dataProfs)[i]]);
                            idData[`${Object.keys(dataProfs)[i]}`][`${data[i][y].id}`] = subLib[`${searchType}`][`${data[i][y].id}`];
                            break;
                        }
                    }
                }
                catch(e){
                    continue;
                }
            }

            
            
        }
        
        return idData;

    }
   
   
    static fillMatrix(x,y,fill = ()=>0)
    {
        let mtrx = [];
        for(var i=0; i<x;i++){
            mtrx.push([]);
            for(var j=0;j<y;j++){
                mtrx[i][j]= fill();
            }
        }
        return mtrx;
    }
    static insertionSort(arr)
    {
        for(var i = 1; i < arr.length; i++){
            var key = arr[i];
            var j = i - 1;
            while(j>= 0 && key < arr[j]){
                arr[j + 1] = arr[j];
                j--;
                


            }
            arr[j + 1] = key;
        }
        return arr;
        
    }
    myListAddHandle(searchType,profile,id)
    {
       
       
        
        const dataBase = JSON.parse(window.localStorage[`${profile}`]);
        if(!dataBase['isInMyList']){
            dataBase['isInMyList'] = {};
        }
        if(!dataBase[`myList`]){
            dataBase['myList'] = {'tv': [], 'movie':[]};
        }
        dataBase['myList'][`${searchType}`].push(`${id}`);
        dataBase['isInMyList'][`${id}`] = 1;
        window.localStorage[`${profile}`] = JSON.stringify(dataBase);
        

    }
    myListRmvHandle(searchType,profile,id)
    {
        const dataBase = JSON.parse(window.localStorage[`${profile}`]);
        var i = 0;
        for(var i = 0; i < dataBase['myList'][`${searchType}`].length; i++){
            if(id ==  dataBase['myList'][`${searchType}`][i]){
                dataBase['myList'][`${searchType}`].splice(i,1);

            }
        }
        dataBase['isInMyList'][`${id}`] = 0;
        window.localStorage[`${profile}`] = JSON.stringify(dataBase);

    }



  
    
    
    
    
   

}