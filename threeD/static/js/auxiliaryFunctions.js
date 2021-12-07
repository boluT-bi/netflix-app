import { genericEvtCurry } from "./eventControls.js";
import RowGen,{PageGen} from "./rowGen.js";
import TMDB_interface from "./tmdbApiInterface.js";

export function clean(node){
    for(var i =0; i <node.childNodes.length; i++){
        var child = node.childNodes[i];
        if(child.nodeType == 8||(child.nodeType === 3 && !/\S/.test(child.nodeValue))){
            node.removeChild(child);
            i--;
        }
        else if(child.nodeType === 1 || child.nodeType === 11){
            clean(child);
        }
    }
}

var y = scrollY;
window.onscroll = ()=>{
    var new_y = scrollY;
    if(new_y > y){
        document.getElementById('Navigate').style.top = '-50%';
        document.getElementById('Navigate').style.backgroundColor = '#0a0a0a';
        if( document.getElementsByClassName('pageIntroContainer').item(0)){
            document.getElementsByClassName('pageIntroContainer').item(0).style.top = '0';
            document.getElementsByClassName('pageIntroContainer').item(0).style.backgroundColor = '#0a0a0a';
        }
    }
    else{
        if( document.getElementsByClassName('pageIntroContainer').item(0)){
            document.getElementsByClassName('pageIntroContainer').item(0).style.top = '10vh';
        }
        document.getElementById('Navigate').style.top = '0%';
    }
    if(new_y == 0){

        document.getElementById('Navigate').style.background = 'linear-gradient(to bottom, rgb(0,0,0) 10%, rgba(0,0,0,0) 95%)';
        if( document.getElementsByClassName('pageIntroContainer').item(0)){
            document.getElementsByClassName('pageIntroContainer').item(0).style.backgroundColor = 'rgba(0,0,0,0)';
        }
    }

    y = new_y;
}

export class Rating{
    constructor(index, rating= 0, searchType = 'tv'){
        this.rating = rating;
        this.index = index;
        this.searchType = searchType;

    }

    setRating()
    {
        
        const rateableList = [].slice.call(document.getElementsByClassName('ratingSystem--item'));
        rateableList.map(node => node.addEventListener('click',(e)=>{
            var svgIndex;
            const ratingRoot = window.localStorage;
           
            
            
            const classList = e.target.parentElement.className["baseVal"].split(' ');
            for(var i = 0; i < classList.length; i++){
                if(/^star--\d$/.test(classList[i])){
                    svgIndex = parseInt(classList[i].split('').slice(-1))-1;

                }
            }
            
           
            var mutable = true;
            for( var j = svgIndex + 1; j < 5;j++){
                
                if(document.getElementsByClassName(`star--${j+1}`).item(this.index).firstElementChild.classList.contains('active')){
                    
                    mutable = false;

                }



            }
            if(svgIndex != 0){
                
                for(var x = svgIndex; x>0;x--){
                    
                    if(!document.getElementsByClassName(`star--${x}`).item(this.index).firstElementChild.classList.contains('active')){
                        
                        
                        document.getElementsByClassName(`star--${x}`).item(this.index).firstElementChild.classList.add('active');
                    }
                   
                }

            }
            
            
            if(mutable){
                
                e.target.classList.toggle('active');
                
                const ratingStore = ratingRoot[`${document.getElementById('profile-user').value}`];
                const parsedRStore = JSON.parse(ratingStore);
                if(e.target.classList.contains('active')){
                    document.getElementById(`${document.getElementsByClassName('ratingSystem').item(this.index).dataset.id}`).parentElement.dataset.rating = `${svgIndex + 1}`;
                        
                    parsedRStore[`${this.searchType}`][`${document.getElementsByClassName('ratingSystem').item(this.index).dataset.id.split('#')[0] || document.getElementsByClassName('ratingSystem').item(this.index).dataset.id}`] = svgIndex + 1;
                    ratingRoot[`${document.getElementById('profile-user').value}`] = JSON.stringify(parsedRStore);
                }
                else{
                    
                    document.getElementById(`${document.getElementsByClassName('ratingSystem').item(this.index).dataset.id}`).parentElement.dataset.rating = `${svgIndex}`;
                    parsedRStore[`${document.getElementsByClassName('ratingSystem').item(this.index).dataset.id.split('#')[0] || document.getElementsByClassName('ratingSystem').item(this.index).dataset.id}`] = svgIndex;
                    ratingRoot[`${document.getElementById('profile-user').value}`] = JSON.stringify(parsedRStore);

                }
                
                

                
                
                
                
               
                
                
                
                
                
                

            }
            
            


        }));

        
    }
    fillSystem()
    {
        const iterVal = this.rating;
        
        for(var j= 1; j<=5; j++){
            document.getElementsByClassName(`star--${j}`).item(this.index).firstElementChild.classList.remove('active');
        }
        
        for(var i = 0; i < iterVal;i++){
            
            document.getElementsByClassName(`star--${i+1}`).item(this.index).firstElementChild.classList.add('active');
            
            
        }
        

    }
   

   
}
// evaluate the row interactions
export function rowActivity(index){

    
                    
                    
                
                    

    const activeNode = document.getElementsByClassName('previewPanel').item(getIndexById(index));
    
    
    
    
    
    for(var i = 0; i < activeNode.parentElement.childNodes.length; i++){
        
        switch(activeNode.parentElement.childNodes[i].nodeType){
            case 3:
                break;
            
            
            case 1:
               
                if(activeNode.parentElement.childNodes[i].classList.contains('previewPanel')){
                    
                    if(activeNode.parentElement.childNodes[i] != activeNode){
                        
                        if(activeNode.parentElement.childNodes[i].className.split(' ')[2]){

                
                            if(activeNode.parentElement.childNodes[i].className.split(' ')[2] == 'activeObject'){
                                activeNode.parentElement.childNodes[i].classList.remove('activeObject');
                                

                            }

                            else{
                                activeNode.parentElement.childNodes[i].dataset.activestatus = '0';
                                break;

                            }
                            activeNode.parentElement.childNodes[i].classList.add('inActiveObject');
                            activeNode.parentElement.childNodes[i].dataset.activestatus = '0';
                            break;



                            
                        }
                        else{
                            activeNode.parentElement.childNodes[i].classList.add('inActiveObject');
                            activeNode.parentElement.childNodes[i].dataset.activestatus = '0';
                            break;


                        }
                    }
                    else{
                        if(activeNode.className.split(' ')[2]){
                            if(activeNode.className.split(' ')[2] == 'inActiveObject'){
                                activeNode.classList.remove('inActiveObject');
    
                            }
                            else{
                                activeNode.dataset.activestatus = `${parseInt(activeNode.dataset.activestatus)+ 1}`;
                                break;
    
                            }
                                

                        
                    

                        
                            activeNode.classList.add('activeObject');
                            activeNode.dataset.activestatus = `${parseInt(activeNode.dataset.activestatus)+ 1}`
                            break;
                        }


                        
                    
                        else{
                            activeNode.classList.add('activeObject');
                            activeNode.dataset.activestatus = `${parseInt(activeNode.dataset.activestatus)+ 1}`
                            
                            break;

                        }
                    }
                }
                else{
                    break;
                }

                
        }
    }

}
//returns root node index specifically for finding elaborateCard root node index- not generalised
export function getIndexById(id)
{
    const node = document.getElementById(id).parentElement.parentElement;
    
    const desiredNodeList = [].slice.call(document.getElementsByClassName(node.className.split(' ')[0]));
    let i = 0;
    while(i < desiredNodeList.length){
        if(node == desiredNodeList[i]){
            break;
        }
        i++
        
    }
    return i;
}



export function addPushElement(node){

    
    let pEl = document.createElement('div');
    pEl.className = 'pusher';
    node.appendChild(pEl);
    
}




export function nthParent(node,n)
{
    return n  > 0 ? nthParent(node.parentElement, n-1) : node;
}


export function matrixToLib(mtrx)
{
    let lib = {};
    for(var i = 0; i < mtrx.length; i ++){
        lib[mtrx[i][0]] = mtrx[i][1];
    }

    return lib;
}
export function createSvg(vb,pathType,pathLib)
{
    let returnedNode = document.createElementNS('http://www.w3.org/2000/svg','svg');
    returnedNode.setAttributeNS(null,'viewbox', vb);
    
    let nodeSibling = document.createElementNS('http://www.w3.org/2000/svg', pathType);
    let keys = Object.keys(pathLib);
    keys.map(k=>nodeSibling.setAttributeNS(null,k,pathLib[k]));
    returnedNode.appendChild(nodeSibling);

    return returnedNode;

}
Document.prototype.createElements = function(kwargs)
{
    let nodes = {};
    for(var i = 0 , keys = Object.keys(kwargs); i < keys.length; i ++){
        
        nodes[keys[i]] = document.createElement(kwargs[keys[i]]);

    }
    return nodes;
}

Document.prototype.createMultiClasses = function(lib,classArr)

{
    if(Object.keys(lib).length != classArr.length){
        throw new RangeError('length of className array and node dictionary arent equal');
    }
    try{
        for(var i = 0, keys = Object.keys(lib); i < keys.length; i++){
            if(Array.isArray(classArr[i])){
                classArr[i].map(x => lib[keys[i]].classList.add(x));
            }
            else{
                lib[keys[i]].className = classArr[i];
            }
        }
    }
    catch(err){
        if(err instanceof RangeError){
            console.log(err);
        }
    }

}
function getDataWithBg(data)
{
    var dataPick = data["results"][Math.floor(Math.random()*data["results"].length)];
    
    if(dataPick.backdrop_path){
        if(dataPick.overview.split(' ').length > 50){
            return getDataWithBg(data);
        }
        else{
            return dataPick
        }
    }
    else{
        return getDataWithBg(data);
    }
}
function generateTombStoneParts()
{
   
    const headStone = document.createElement('div'),
        tsInfo = document.createElement('div'),
        infoHeader = document.createElement('h2'),
        tsSynopses = document.createElement('div'),
        overViewText = document.createElement('p'),
        btnCtnr = document.createElement('div'),
        plyBtn = document.createElement('div'),
        featureCtnr1 = document.createElement('div'),
        featureCtnr2 = document.createElement('div'),
        plyIcnSvg = document.createElement('div'),
        
        plyBtnPlcHldr = document.createElement('span'),
        moreInfoBtnCtnr = document.createElement('div'),
        moreInfoIcn = document.createElement('i'),
        moreInfoBtnPlcHldr = document.createElement('span');

        headStone.className = 'tombStone-ctnr';
        tsInfo.className = 'tsInfo-ctnr';
        tsSynopses.className = 'tsInfo--synopses';
        btnCtnr.className = 'callToAct';
        plyBtn.className = 'callToAct--play';
        plyIcnSvg.classList.add('playButtonIcn');
        featureCtnr1.className = 'featureCtnr';
        featureCtnr2.className = 'featureCtnr';
        plyBtnPlcHldr.textContent = 'Play';
        plyBtnPlcHldr.style.top = '10%';
        moreInfoBtnCtnr.className = 'callToAct--info';
        moreInfoIcn.className = 'fa';
        moreInfoIcn.classList.add('fa-info-circle');
        moreInfoBtnPlcHldr.textContent = 'More Info';
        
        
        tsInfo.appendChildren(infoHeader,tsSynopses,btnCtnr);
        btnCtnr.appendChildren(plyBtn,moreInfoBtnCtnr);
        featureCtnr1.appendChildren(plyIcnSvg,plyBtnPlcHldr);
        plyBtn.appendChild(featureCtnr1);
        featureCtnr2.appendChildren(moreInfoIcn,moreInfoBtnPlcHldr);
        moreInfoBtnCtnr.appendChild(featureCtnr2);
        tsSynopses.appendChild(overViewText);
        headStone.appendChild(tsInfo);


        document.getElementsByClassName('subContentOne').item(0).appendChild(headStone);
        





}
export async function createTombStone(searchType,data)
{
    

    const tombStoneData = getDataWithBg(data);
    
    document.getElementsByClassName('tombStone-ctnr').item(0) || generateTombStoneParts();
    
    document.getElementsByClassName('tombStone-ctnr').item(0).setAttribute('style',`background: linear-gradient(to right, rgb(0,0,0) 30%, rgba(0,0,0,0) 75%) no-repeat,
     url('https://image.tmdb.org/t/p/original${tombStoneData.backdrop_path}') no-repeat; background-size: 100% 100%, 70% 100%; background-position: 0%, 100%`);
    
    tombStoneData.title ? document.getElementsByClassName('tsInfo-ctnr').item(0).firstElementChild.textContent = tombStoneData.title:document.getElementsByClassName('tsInfo-ctnr').item(0).firstElementChild.textContent = tombStoneData.name;
    document.getElementsByClassName('tsInfo--synopses').item(0).firstElementChild.textContent = tombStoneData.overview;

}
export function genreListFunctionalization()
{
    const genreItems = Array.prototype.slice.call(document.getElementsByClassName('genreList--item'));
    
    let API_INSTANCE = new TMDB_interface();
    genreItems.map((x)=>{
        Array.isArray(API_INSTANCE.genres[x.parentElement.dataset.type][x.textContent]) ? x.href = `/browse/genre/${API_INSTANCE.genres[`${x.parentElement.dataset.type}`][x.textContent].join(',')}?bc=${x.parentElement.dataset.type}`: x.href = `/browse/genre/${API_INSTANCE.genres[`${x.parentElement.dataset.type}`][x.textContent]}?bc=${x.parentElement.dataset.type}`;
    });


}
    
export function multiConcat(...args){
    const mainArr = args[0].slice();
    for(var i = 1; i < args.length; i++){
        mainArr.concat(args[i]);
    }

    return mainArr;
    
}
    
   








export function nthChild(node,val){
    
    return val > 0 ? nthChild(node.firstElementChild,val - 1): node;
}

export function searchToggle(){
    
        
    document.getElementsByClassName('fa-search').item(0).addEventListener('click', function(){
        
        document.getElementsByClassName('searchInpt').item(0).classList.contains('toggle') ? 
        document.getElementsByClassName('searchInpt').item(0).classList.remove('toggle'): document.getElementsByClassName('searchInpt').item(0).classList.add('toggle');
    });
    document.addEventListener('click', function(e){
        
        if(e.target.parentElement != document.getElementById('search')){
            
            document.getElementsByClassName('searchInpt').item(0).classList.remove('toggle');
        }
        
    });
               
                
               
               
            
            

    



}

function dropDownToggle(){
    let args = [].slice.call(arguments[0][0])
    
    args[1].style.transform = 'rotate(180deg)';
    args[0].style.display = 'flex';

    
    
    
        
    
}
function dropDownOff()
{
    let args = [].slice.call(arguments[0][0]);
    args[1].style.transform = 'rotate(0deg)';
    args[0].style.display = 'none';
}

export const profileListDropDown = genericEvtCurry(document.getElementsByClassName('arrowHead-container').item(0), 'mouseover',dropDownToggle,document.getElementsByClassName('dropDown-menu').item(0),document.getElementsByClassName('dropDown-menu--icon').item(0));
export const profileListDropDownOff = genericEvtCurry(document.getElementsByClassName('dropDown-menu').item(0),'mouseleave',dropDownOff, document.getElementsByClassName('dropDown-menu').item(0), document.getElementsByClassName('dropDown-menu--icon').item(0));





