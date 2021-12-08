import Search from '../js/querySearch.js';
import TMDB_interface from '../js/tmdbApiInterface.js';
import {Rating,rowActivity,getIndexById,nthParent,nthChild,createSvg,matrixToLib,createTombStone,searchToggle,profileListDropDown, profileListDropDownOff} from '../js/auxiliaryFunctions.js';
import RowGen,{PageGen,MF, recommendSkel,unsortedMatrix,heapSort} from '../js/rowGen.js';
import ClientData from '../js/clientDataControls.js';







// display details of row item
window.displayCard = async function displayCard(){
    
    let iNode = nthParent(this,2);
    if(iNode.dataset.id){
        
        var id = iNode.dataset.id;
        
        var assetHolder = document.getElementsByTagName('img').namedItem(`${id}`);
        rowActivity(id);
        
        const apiInterfaceObject = new TMDB_interface((id.split('#')[0] || id),assetHolder.dataset.type);
    
        const data = await apiInterfaceObject.searchById(id.split('#')[0] || id);
        const cast_data = await apiInterfaceObject.searchCast();
        const indexVal = getIndex(nthParent(assetHolder,3));
        
        
        const ratingRoot = JSON.parse(window.localStorage[`${document.getElementById('profile-user').value}`]);
       

        const rating = ratingRoot[`${assetHolder.dataset.type}`][`${id.split('#')[0] || id}`];
        
        
        var elaborateCardFunctionality;
        if(!rating){
            elaborateCardFunctionality = new Rating(indexVal,0,assetHolder.dataset.type);

        }
        else{
            elaborateCardFunctionality = new Rating(indexVal, rating);
        }
        
        elaborateCardFunctionality.fillSystem();
        elaborateCardFunctionality.setRating();
        
        const elaborateList = [].slice.call(document.getElementsByClassName('elaborateCard'));
        const elabInfoNode = document.getElementsByClassName('elaborateCard--info').item(indexVal);
        
        document.getElementsByClassName('ratingSystem').item(indexVal).setAttribute('data-id', `${id}`);
        
        if(/.jpg$/.test(data.backdrop_path)){
            elabInfoNode.parentElement.setAttrs( {'style':`background:linear-gradient(to right,
            rgb(0,0,0) 40%, rgba(0,0,0,0) 60%) no-repeat,url(https://image.tmdb.org/t/p/original${data.backdrop_path}) no-repeat; background-size:90% 100%, 70% 100%; background-position:0%,100%;`});
        }
        else{
            elabInfoNode.parentElement.setAttrs( {'style':`background:linear-gradient(to right,
                rgb(0,0,0) 40%, rgba(0,0,0,0) 60%) no-repeat,url(#${data.backdrop_path}) no-repeat; background-size:90% 100%, 70% 100%; background-position:0%,100%;`},{'data-title': 'Img placeholder'});
            
        }
        data.name ? elabInfoNode.childNodes[0].textContent= data.name: elabInfoNode.childNodes[0].textContent= data.title;
        
        data.release_date ? elabInfoNode.childNodes[1].innerHTML = `<p class = 'releaseYear'>${data.release_date.split('-')[0]}</p>`: elabInfoNode.childNodes[1].innerHTML = `<p class = 'releaseYear'>${data.first_air_date.split('-')[0]}</p>`
        elabInfoNode.childNodes[2].textContent = data.overview;
        elabInfoNode.childNodes[5].innerHTML = `<p class = 'elab-info--castLabel'>Starring: </p><p>${cast_data.cast.slice(0,4).join(', ')}</p>`;
        elabInfoNode.childNodes[6].innerHTML = `<p class="elab-info--genreLabel">Genres: </p>${textSeperator(data.genres, ', ')}`;
        document.getElementsByClassName('myListIcn-ctnr').item(indexVal).className = 'myListIcn-ctnr'
        if(document.getElementsByTagName('img').namedItem(`${id}`).parentElement.dataset.inmylist){
            
            document.getElementsByClassName('myListIcn-ctnr').item(indexVal) && (document.getElementsByClassName('myListIcn-ctnr').item(indexVal).className = 'myListRmv-ctnr');
        }
        document.getElementsByClassName('pusher').item(0).classList.add('pushActive');
        document.getElementsByTagName('footer').item(0).classList.add('pushActive');

        
        document.getElementsByClassName('elaborateCard').item(indexVal).classList.add(`row${indexVal}`);
        for(var i = 0; i< elaborateList.length;i++){
            if(`row${i}`!= `row${indexVal}`){
                document.getElementsByClassName('elaborateCard').item(i).style.display = 'none';
               
                
            }
            else{

                document.getElementsByClassName(`row${indexVal}`).item(0).style.display = 'flex';
                

            }
        }
        document.getElementsByClassName('elaborateCard').item(indexVal).style.top = `calc(${document.getElementsByClassName('previewPanel').item(indexVal).offsetTop}px + ${document.getElementsByClassName('previewPanel').item(indexVal).clientHeight}px - 30px)`;

    }
}
//assign multiple properties to node 

Element.prototype.setAttrs = function(attrs){
    
    for(var key in attrs){
        this.setAttribute(key, attrs[key]);
        
            
        
        
    }

    

    
    

}

// returns class index
function getIndex(node)
{
    const nodeList = [].slice.call(document.getElementsByClassName(node.className.split(' ')[0]));
    for(var i = 0; i < nodeList.length; i++){
        if(nodeList[i] == node){
            return i;
        }
    }
    return null;

}
//scroll function for rows with unknown n.o items
window.specialCaseScroll = function specialCaseScroll()
{   const leftDir = 1;
    const rightDir = -1;
    const panelWidth = 97/100 * window.innerWidth;
    const widthVal = document.getElementsByClassName('prevObject').item(0).clientWidth;
    const numOfEls = Math.round(panelWidth/widthVal);
    const mainPanel = this.parentElement;
    
    
    const nodeList = Array.prototype.slice.call(document.getElementsByClassName('prevObjectConveyor').item(getIndex(this)).childNodes);
    var dir,index;
    if(this.classList.contains('ScrollRight')){
        
        index = parseInt(this.value) + numOfEls;
        dir = rightDir;
        if(index == numOfEls){
            document.getElementsByClassName('ScrollLeft').item(getIndex(this)).style.display = 'inline-block';

        }
        if(!nodeList[index + numOfEls]){
            this.style.display = 'none';
        }
    }

    else{
        index = parseInt(document.getElementsByClassName('ScrollRight').item(getIndex(this)).value) - numOfEls;
        dir = leftDir;
        
        document.getElementsByClassName('ScrollRight').item(getIndex(this)).style.display = 'inline-block';
        if(index == 0){
            this.style.display = 'none';
        }

    }
    document.getElementsByClassName('ScrollRight').item(getIndex(this)).value = `${index}`;
    const rightVal = numOfEls * widthVal * dir;
    console.log(rightVal);
    
    [].slice.call(mainPanel.childNodes).map((node)=>{
        
        
        if(node.tagName != 'button'.toUpperCase() && node.tagName != null){
            if(node.style.getPropertyValue('--t1') == ''){
                node.style.setProperty('--t1', `translateX(${rightVal}px)`);
            }
            
            else{
                node.style.setProperty('--t1', `translateX(${parseInt(node.style.getPropertyValue('--t1').split('(')[1].slice(0, node.style.getPropertyValue('--t1').split('').length - 3))+ rightVal}px)`);
            }

            
            
        
                
                
            
                
             
            
            
            

        }
    
        
    });





}
//hide elaborate Card
window.hideCard = function hideCard()
{
    nthParent(this,2).style.display = 'none';
    document.getElementsByClassName('activeObject').item(0).classList.remove('activeObject');
    let inActiveNodes = Array.prototype.slice.call(document.getElementsByClassName('inActiveObject'));
    let pushActiveNodes = Array.prototype.slice.call(document.getElementsByClassName('pushActive'));
    inActiveNodes.map(x => x.classList.remove('inActiveObject'));
    pushActiveNodes.map(x => x.classList.remove('pushActive'));

}
//handle myList requests for info card
window.elabMyListHandle = function elabMyListHandle()
{
    const searchType = document.getElementsByTagName('img').namedItem(`${document.getElementsByClassName('ratingSystem').item(getIndex(this)).dataset.id}`).dataset.type;
    console.log(searchType);
    const addData = {
        preStored: JSON.parse(window.localStorage[`${document.getElementById('profile-user').value}`]),
        add: ()=>{
            const myListData = new ClientData();
            myListData.myListAddHandle(searchType,document.getElementById('profile-user').value,(document.getElementsByClassName('ratingSystem').item(getIndex(this)).dataset.id.split('#')[0] || document.getElementsByClassName('ratingSystem').item(getIndex(this)).dataset.id));
        }
    }
    const rmvData = {
        preStored: JSON.parse(window.localStorage[`${document.getElementById('profile-user').value}`]),
        rmv: ()=>{
            const myListData = new ClientData();
            myListData.myListRmvHandle(searchType,document.getElementById('profile-user').value,(document.getElementsByClassName('ratingSystem').item(getIndex(this)).dataset.id.split('#')[0] || document.getElementsByClassName('ratingSystem').item(getIndex(this)).dataset.id));


        }
    }
    if(this.firstElementChild.classList.contains('myListIcn-ctnr')){
        addData.add();
        this.firstElementChild.classList.remove('myListIcn-ctnr');
        this.firstElementChild.classList.add('myListRmv-ctnr');
        document.getElementsByTagName('img').namedItem(`${document.getElementsByClassName('ratingSystem').item(getIndex(this)).dataset.id}`).parentElement.setAttribute('data-inMyList', 'true');
    }
    else{
        rmvData.rmv();
        this.firstElementChild.classList.remove('myListRmv-ctnr');
        this.firstElementChild.classList.add('myListIcn-ctnr');
        document.getElementsByTagName('img').namedItem(`${document.getElementsByClassName('ratingSystem').item(getIndex(this)).dataset.id}`).parentElement.removeAttribute('data-inMyList');
    }
    


}
// handle myList requests
window.myListHandle = function myListHandle()
{   
    const searchType  = document.getElementsByTagName('img').namedItem(`${nthParent(this,2).dataset.id}`).dataset.type;
    const addData = {
        preStored: JSON.parse(window.localStorage[`${document.getElementById('profile-user').value}`]),
        add: ()=>{
            const myListData = new ClientData();
            myListData.myListAddHandle(searchType,document.getElementById('profile-user').value,nthParent(this,2).dataset.id);
        }
    }
    const rmvData = {
        preStored:JSON.parse(window.localStorage[`${document.getElementById('profile-user').value}`]),
        rmv: ()=>{
            const myListData = new ClientData();
            myListData.myListRmvHandle(searchType,document.getElementById('profile-user').value,nthParent(this,2).dataset.id);

        }
    }
    
    
    
    if(this.classList.contains('myLstBtn')){
        addData.add();
        
        this.classList.remove('myLstBtn');
        this.classList.add('rmvItemBtn');
        document.getElementsByTagName('img').namedItem(nthParent(this,2).dataset.id).parentElement.setAttribute('data-inMyList', 'true');

        this.setAttribute('data-prompt','Remove from My List');
        
    }
    else{
        rmvData.rmv();
        this.classList.remove('rmvItemBtn');
        this.classList.add('myLstBtn');
        document.getElementsByTagName('img').namedItem(nthParent(this,2).dataset.id).parentElement.removeAttribute('data-inMyList');
        this.setAttribute('data-prompt', 'Add to My List');
        

    }

}




//scroll across row items
window.scrollFunction = function scrollFunction(){
   
    const leftDir = 1;
    const rightDir = -1;
    const panelWidth = 97/100 * window.innerWidth;
    const widthVal = 19.1/20 * panelWidth;
    
    
    const movingPanel = this.parentElement;
    
    var dir,val;
    if(document.getElementById(this.id).className == 'ScrollRight'){
        val = parseInt(this.value) + 1;
        document.getElementsByClassName('ScrollLeft').item(getIndex(document.getElementById(this.id))).style.display = 'inline-block';
        
        dir = rightDir;
        
    if(val == 3){
        
        document.getElementById(this.id).style.display = 'none';
    }
    
    }
    else{
        val = parseInt(document.getElementsByClassName('ScrollRight').item(getIndex(document.getElementById(this.id))).value)-1;
        
        document.getElementsByClassName('ScrollRight').item(getIndex(document.getElementById(this.id))).style.display = 'inline-block';
        dir = leftDir;
        if(val == 0){
            document.getElementById(this.id).style.display = 'none';
        }
    
    }
    document.getElementsByClassName('ScrollRight').item(getIndex(document.getElementById(this.id))).value = `${val}`;
    
    var rightVal = Math.round(widthVal*dir);
    
    

        
    
    movingPanel.childNodes.forEach(function(node){
        
        
        if(node.tagName != 'button'.toUpperCase() && node.tagName != null){
            if(node.style.getPropertyValue('--t1') == ''){
                node.style.setProperty('--t1', `translateX(${rightVal}px)`);
            }
            
            else{
                console.log(parseInt(node.style.getPropertyValue('--t1').split('(')[1].slice(0, node.style.getPropertyValue('--t1').split('').length - 3)), rightVal);
                node.style.setProperty('--t1', `translateX(${parseInt(node.style.getPropertyValue('--t1').split('(')[1].slice(0, node.style.getPropertyValue('--t1').split('').length - 3))+ rightVal}px)`);
            }

            
            
        
                
                
            
                
             
            
            
            

        }
    
        
    });



}

function applyTranslationAroundN(node,n,x,y)
{
    
    const arr = [].slice.call(node.childNodes);
    arr.slice(0,n).map(t => t.style.transform = `translateX(${x}%)`);
    arr.slice(n+1, arr.length).map(j => j.style.transform = `translateX(${y}%)` );

}


// genreList drop down handler
export function dropDownConfig(){
    let args = [].slice.call(arguments[0][0]);
    
    args[0].classList.toggle('dropActive');
    if(args[0].classList.contains('dropActive')){
        args[0].style.backgroundColor = 'grey';
        args[2].style.display = 'flex';
        args[2].style.height  = `${args[1]}vh`;
    }
    else{
        args[2].style.display = 'none';
        args[0].style.backgroundColor = 'rgb(0,0,0)';
        args[2].style.height = '0';
    }

}
//helper function returns either one keyword describing movie or text seperated list of keywords
function textSeperator(arr,delimiter)
{
   
    let divArr = [];
    
    let genreProperty = new RowGen();
    var textVal;
    let genreLib = genreProperty.reverseGenres;
    if(arr.length > 1){
        if(arr[0].name){
            for(var i = 0; i < arr.length; i++){
                divArr.push(`<p>${arr[i].name}</p>`);
            }
            textVal = divArr.join(delimiter);
        }
        else{
            for(var i = 0; i < arr.length; i++){
                divArr.push(`<p>${genreLib[arr[i]]}</p>`);
            }
            textVal = divArr.join(delimiter);

        }
    }
    else{
        if(arr[0].name){
            textVal = `<p>${arr[0].name}</p>`;
        }
        else{
            textVal = `<p>${genreLib[arr[0]]}</p>`;
        }
    }
    return textVal;
}
//remove special characters
String.prototype.trimSpeacialCase = function(char)
{

}
// creates pop-up when row-item hovered
window.activatePopUp = async function activatePopUp(elem)
{
    

    elem.classList.add('popup-active');
    const pNode = nthParent(elem,3);
    let actvNode;
    elem.childNodes.length > 1 ? actvNode = elem.firstElementChild.nextSibling: actvNode = elem.firstElementChild;
    
    const nodeArray = [].slice.call(elem.parentElement.childNodes);
    const panelWidth = 0.97 * window.innerWidth;
    const noItems =  Math.round(panelWidth/elem.clientWidth);
    const compStyles = window.getComputedStyle(nthParent(actvNode,2));
    const subCompStyles = window.getComputedStyle(elem);
    const width = parseFloat(subCompStyles.getPropertyValue('width').split('p')[0])/parseFloat(compStyles.getPropertyValue('width').split('p')[0]) * 100;
    
    const cntrlIndex = nodeArray.indexOf(elem);
    const dLeftOffset = parseFloat((elem.offsetLeft/window.innerWidth) * 0.97) * 100;
    
    const leftOffset = parseFloat(elem.style.left.split('(')[1].slice(0, elem.style.left.split('(')[1].length -1));
    applyTranslationAroundN(nthParent(elem,1),cntrlIndex,-5,5);
    const nodes = document.createElements({previewCtnr: 'div',previewImgPlaceHolder: 'div', previewImg:'img', previewCues: 'div', previewCuesBtn: 'button',
     previewCuesInfo: 'div', previewCuesIcon: 'i',previewCuesPlay: 'button',
     previewCuesMyList: 'button', previreCuesMyListIcn: 'i',previewCuesMyListIcn2: 'i'});
    
   
    
        
    const playBtn = createSvg('0 0 10 10', 'path',{'d': 'M 0 0 L 10 5 L 0 10 L 0 0'});
    playBtn.setAttributeNS(null,'class','playBtn--icn');
    const keys = Object.keys(nodes);
    nodes[keys[0]].setAttribute('data-id', `${actvNode.id}`);
    nodes[keys[0]].addEventListener('mouseleave', deactivatePopUp);
    //nodes[keys[0]].setAttribute('style', 'transform: translateX(-30px) translateY(0px) scaleX(1) scaleY(1) translateZ(0px);')
    
    
    nodes[keys[0]].style.height = `calc(${nthParent(actvNode,3).clientHeight}px + 10px)`;
    nodes[keys[4]].setAttribute('data-prompt','More details');
    nodes[keys[7]].setAttribute('data-prompt', 'Play trailer');
    
    
    if(elem.dataset.inmylist){ 
        
        document.createMultiClasses(nodes, ['preview-ctnr', 'preview-imgplchldr', 'preview-img','preview-cues', ['btn-preConfig','preview-cues--btn'],
        'preview-cues--info', 'preview-cues--icn',['btn-preConfig','plyBtn'],
        ['btn-preConfig','rmvItemBtn'],'myLstBtn--icn', 'myLstBtn--icn2']);
        
        nodes[keys[8]].setAttribute('data-prompt','Remove from My List');
        
        
    }
    else{
        document.createMultiClasses(nodes, ['preview-ctnr', 'preview-imgplchldr', 'preview-img','preview-cues', ['btn-preConfig','preview-cues--btn'],
        'preview-cues--info', 'preview-cues--icn',['btn-preConfig','plyBtn'],
        ['btn-preConfig','myLstBtn'],'myLstBtn--icn', 'myLstBtn--icn2']);
       
        nodes[keys[8]].setAttribute('data-prompt','Add to My List');

    }
    nodes[keys[8]].addEventListener('click', myListHandle);

    const cNodes = [].slice.call(nthParent(elem,1).childNodes);
    if(cNodes.indexOf(elem) >= noItems){
        const cnveyorStyles = window.getComputedStyle(nthParent(elem,1));
        const rightVal = parseInt(cnveyorStyles.getPropertyValue('transform').split('(')[1].split(',')[4]);
     
        const r = cNodes.indexOf(elem) % noItems;
        const factor = cNodes.indexOf(elem) - r;
        let errFrac;
        rightVal < 0 ? errFrac = cNodes[factor].offsetLeft + rightVal: errFrac = cNodes[factor].offsetLeft - rightVal;
        
        nodes[keys[0]].style.left = `calc(${r * width}% + ${errFrac}px + 0.8%)`;
        
        
    }
    else{
        
        nodes[keys[0]].style.left = `calc(${elem.offsetLeft}px + ${nthParent(elem,2).offsetLeft}px - 2%)`;
        
    }

    nodes[keys[0]].style.width = `${1.2 * nthParent(actvNode,1).clientWidth}px`;
    if(document.getElementsByClassName('activeObject').item(0)){
        
        if(nthParent(elem,2).classList.contains('inActiveObject')){
            if(nthParent(elem,2).offsetTop < document.getElementsByClassName('activeObject').item(0).offsetTop){
                nodes[keys[0]].style.top = `calc(${nthParent(actvNode,3).offsetTop}px + 15px)`;

            }
            else{
                var IArow_style = window.getComputedStyle(nthParent(elem,2));
                nodes[keys[0]].style.top = `calc(${parseInt(IArow_style.getPropertyValue('transform').split(',')[IArow_style.getPropertyValue('transform').split(',').length - 1].split('').slice(0,-1).join(''))}px + ${nthParent(elem,2).offsetTop}px + 15px)`;
            }
        
        }
        else{
            
            nodes[keys[0]].style.top = `calc(${nthParent(actvNode,3).offsetTop}px + 15px)`;

        }
    }
    else{
        nodes[keys[0]].style.top = `calc(${nthParent(actvNode,3).offsetTop}px + 15px)`;
    }
    
    nodes[keys[1]].appendChild(nodes[keys[2]]);
    nodes[keys[4]].appendChild(nodes[keys[6]]);
    nodes[keys[7]].appendChild(playBtn);
    nodes[keys[4]].addEventListener('click',displayCard);
    nodes[keys[8]].appendChildren(nodes[keys[9]], nodes[keys[10]]);
    
    nodes[keys[3]].appendChildren(nodes[keys[4]],nodes[keys[5]],nodes[keys[7]],nodes[keys[8]]);
    nodes[keys[0]].appendChildren(nodes[keys[1]],nodes[keys[3]]);
    pNode.appendChild(nodes[keys[0]]);
    
    console.log(nodes[keys[0]].offsetLeft);
    const searchCriteria = new TMDB_interface((actvNode.id.split('#')[0] || actvNode.id),actvNode.dataset.type);
    
    const data = await searchCriteria.searchById();
    
    if(/.jpg$/.test(data.backdrop_path)){
        nodes[keys[2]].src = `http://image.tmdb.org/t/p/w500${data.backdrop_path}`;
    }
    else{
        nodes[keys[1]].classList.add(data.backdrop_path);
        nodes[keys[2]].style.visibility = 'hidden';
        data.title ? nodes[keys[1]].setAttribute('data-title', `${data.title}`): nodes[keys[1]].setAttribute('data-title', `${data.name}`);
    }
   
    data["results"] ? nodes[keys[5]].innerHTML = textSeperator(data["results"].genre_ids, '<svg class = "delimiter" xmlns = "http://www.w3.org/2000/svg" viewbox = "0 0 10 10">\n <circle cx = "5" cy = "5" r = "5"/>\n</svg>') : nodes[keys[5]].innerHTML = textSeperator(data.genres,'<svg class = "delimiter" xmlns = "http://www.w3.org/2000/svg" viewbox = "0 0 10 10">\n <circle cx = "5" cy = "5" r = "5"/>\n</svg>');
    
}
// removes pop-up when cursor moved from containing area
window.deactivatePopUp = function deactivatePopup()
{   
    
    const id = this.dataset.id;
    nthParent(document.getElementsByTagName('img').namedItem(`${id}`),1).classList.remove('popup-active');
    const parentToPrevs = nthParent(document.getElementsByTagName('img').namedItem(`${id}`),2);
    const arr = [].slice.call(parentToPrevs.childNodes);
    const cntrlIndex = arr.indexOf(document.getElementsByTagName('img').namedItem(`${id}`).parentElement);
    applyTranslationAroundN(parentToPrevs,cntrlIndex,0,0);
    this.setAttribute('style', 'transform: translateX(0px) translateY(43px) scaleX(0.7846) scaleY(0.7846) translateZ(0px);');
    this.setAttribute('style', 'transform: translateX(0px) translateY(58px) scaleX(0.6978) scaleY(0.6978) translateZ(0px);');

    this.remove();
   
   
}
//toggle view mode parameters dropdown
window.viewPrmtrToggle = function viewPrmtrToggle()
{
    
    document.getElementsByClassName('viewHndle-drpDwn').item(0).classList.toggle('prmtrDD-active');

}

// genreList drop down capture
// curry function for handling eventlisteners with multiple parameters
export function genericEvtCurry(node,evt,func,...args)
{
    
    var f =  function(ff,...iterable){
        return(function(){
            
            ff(iterable);
        });
    }(func,args);
    node.addEventListener(evt,f,false);
   
    return f;
    
}

// change view parameter
export function changePrmtr()
{
    let args = [].slice.call(arguments[0][0]);
    args[0].style.display = 'none';
    Array.prototype.slice.call(nthParent(args[0],1).childNodes).map((x)=>{
        
        if(x.style.display == 'none' && x.textContent != args[0].textContent){
            x.style.display = 'block';
        }
    });
    
    
    document.getElementsByClassName('viewHndle-optionPlchldr').item(0).firstElementChild.textContent = args[0].textContent.toUpperCase();
    const hideNodes = Array.prototype.slice.call(document.getElementsByClassName('previewPanel'));
    const hideElabCards = Array.prototype.slice.call(document.getElementsByClassName('elaborateCard'));
    document.getElementsByClassName('sugg-null')?.item(0)?.remove();
    hideElabCards.map( x => x.remove());
    hideNodes.map(x => x.remove());
    args[2] ? displayCriteriaSubCat(args[0].textContent.toUpperCase(),args[1],args[2]):displayCriteria(args[0].textContent.toUpperCase(),args[1]);

}
async function displayCriteriaSubCat(param,searchType,subCat){
    
    switch(param){

        case 'SUGGESTIONS FOR YOU':
            
            const gridPage = new PageGen();
            const gridData =  new ClientData();
            const genreData = await gridData.initializeGenreDatabase(searchType,subCat);
            
            if(genreData[`${document.getElementById('profile-user').value}`] && Object.keys(genreData[`${document.getElementById('profile-user').value}`]).length >= 5){
                const untrainedMatrix = gridData.constructDynamicDataMatrix(document.getElementById('profile-user').value, searchType,genreData);
                const mtrxTrainer = new MF(untrainedMatrix);
                const factors = mtrxTrainer.train();
                const trainedMatrx = mtrxTrainer.fullMatrix(factors);
                const suggestionsLib = recommendSkel(genreData,trainedMatrx,searchType);
                const unsortedMtrx =  unsortedMatrix(suggestionsLib);
                heapSort(unsortedMtrx);
                const sortedSuggestionLib = matrixToLib(unsortedMtrx);
                gridPage.generateIdPage(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,Object.keys(sortedSuggestionLib),'movie');
            }
            else{
                const nullPrompt = document.createElement('p');
                nullPrompt.textContent = 'No Suggestions Just Yet';
                nullPrompt.className = 'sugg-null';
                document.getElementsByClassName('subContentOne').item(0).appendChild(nullPrompt);
            }
        break;
        case 'YEAR RELEASED':
            const gridPageReleaseYear = new PageGen();
            gridPageReleaseYear.generatePageByCriteria(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,'YEAR RELEASED',searchType,10,1,subCat);
        break;
        case 'A-Z':
            
            const gridPageChronological = new PageGen();
            gridPageChronological.generatePageByCriteria(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,'A-Z',searchType,[10,40],1,subCat);

        break;

        case 'Z-A':
            const gridPageReverseChronological = new PageGen();
            gridPageReverseChronological.generatePageByCriteria(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,'Z-A',searchType,[10, 40],1,subCat);
        break;
    }


}
function displayCriteria(param,searchType)
{
   
    switch(param){

        case 'SUGGESTIONS FOR YOU':
            const gridPage = new PageGen();
            const gridData =  new ClientData();
            
            
            if(window.localStorage[`${document.getElementById('profile-user').value}`] && Object.keys(JSON.parse(window.localStorage[`${document.getElementById('profile-user').value}`])[searchType]).length >= 5){
                const untrainedMatrix = gridData.constructMatrix(document.getElementById('profile-user').value, searchType);
                
                const mtrxTrainer = new MF(untrainedMatrix);
                const factors = mtrxTrainer.train();
                const trainedMatrx = mtrxTrainer.fullMatrix(factors);
                
                const suggestionsLib = recommendSkel(window.localStorage,trainedMatrx,searchType);
                const unsortedMtrx =  unsortedMatrix(suggestionsLib);
                heapSort(unsortedMtrx);
                
                const sortedSuggestionLib = matrixToLib(unsortedMtrx);
                gridPage.generateIdPage(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,Object.keys(sortedSuggestionLib),searchType);
            }
            else{
                const nullPrompt = document.createElement('p');
                nullPrompt.textContent = 'No Suggestions Just Yet';
                nullPrompt.className = 'sugg-null';
                document.getElementsByClassName('subContentOne').item(0).appendChild(nullPrompt);

            }
        break;
        case 'YEAR RELEASED':
            const gridPageReleaseYear = new PageGen();
            gridPageReleaseYear.generatePageByCriteria(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,'YEAR RELEASED',searchType,10);
        break;
        case 'A-Z':
            
            const gridPageChronological = new PageGen();
            gridPageChronological.generatePageByCriteria(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,'A-Z',searchType, [10,40]);

        break;

        case 'Z-A':
            const gridPageReverseChronological = new PageGen();
            gridPageReverseChronological.generatePageByCriteria(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,'Z-A',searchType,[10,40]);
        break;
    }
}
async function redisplayRow(searchType)
{
    const page = new RowGen();
    const API_INSTANCE = new TMDB_interface(null,searchType)
    const STORAGE_INSTANCE = new ClientData();
    const TS_DATA = await API_INSTANCE.searchPopularTitles(null,1);
    createTombStone(searchType,TS_DATA);
    page.generatePopularRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,searchType,null,1,'Popular');
    const genreList = page.generateGenreTags(5,searchType);
    const row = new RowGen();
    page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[0],searchType,null,1,genreList[0]);
    const myListData = JSON.parse(window.localStorage[`${document.getElementById('profile-user').value}`]);
    if(Object.keys(myListData['myList'][`${searchType}`]).length){
   
        const myListRow = new RowGen(myListData['myList'][`${searchType}`].length, 'My List', 'row', true);
        myListRow.generateRowById(document.getElementsByClassName('subContentOne').item(0),myListData['myList'][`${searchType}`],searchType,document.getElementById('profile-user').value,'My List');
    }
    if(window.localStorage[`${document.getElementById('profile-user').value}`] && Object.keys(window.localStorage).length > 1){
        const matrixFactorized = new MF(STORAGE_INSTANCE.constructMatrix(document.getElementById('profile-user').value,searchType));
        const factors = matrixFactorized.train();
        const recommendMatrix = matrixFactorized.fullMatrix(factors);
    
    
        const recommendHM = recommendSkel(window.localStorage,recommendMatrix,searchType);
    
        const idMatrix = unsortedMatrix(recommendHM);
    
        heapSort(idMatrix);
        if(idMatrix.length >= 20){
            const top20recommendedLib = matrixToLib(idMatrix.slice(0,20));
    
            row.generateRowById(document.getElementsByClassName('subContentOne').item(0),Object.keys(top20recommendedLib),searchType,document.getElementById('profile-user').value,`Top Picks For ${document.getElementById('profile-user').value}`);
        }
    }
    
   
    
   
    
    page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[1],searchType,null,2,genreList[1]);
    page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[2],searchType,null,3,genreList[2]);
    page.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,genreList[3],searchType,null,4,genreList[3]);
        
}
async function redisplayRowSubCat(searchType,subCat)
{
    const INITIALIZE_DATA = new ClientData();
    INITIALIZE_DATA.initializeDataBase(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,searchType);
    const GENRE_DATA_INSTANCE = new ClientData();
    const GENRE_DATA = await GENRE_DATA_INSTANCE.initializeGenreDatabase(searchType,subCat);
    const GENRE_ID = document.getElementById('genre-id').value;
    const ROWGEN_INSTANCE = new RowGen(20,null,searchType,false);
    const GENRE = ROWGEN_INSTANCE.reverseGenres[`${searchType}`][`${GENRE_ID}`];
    const API_INSTANCE = new TMDB_interface(null, searchType);
    const TS_Data = await API_INSTANCE.searchTvByGenre(GENRE);
    createTombStone(searchType,TS_Data);
    if(GENRE_DATA[`${document.getElementById('profile-user').value}`] && Object.keys(GENRE_DATA[`${document.getElementById('profile-user').value}`]).length >= 5){
        const GENRE_MATRIX = GENRE_DATA_INSTANCE.constructDynamicDataMatrix(document.getElementById('profile-user').value,searchType,GENRE_DATA);
        
        const matrixFactorized = new MF(GENRE_MATRIX);
        const factors = matrixFactorized.train();
        const recommendMatrix = matrixFactorized.fullMatrix(factors);


        const recommendHM = recommendSkel(GENRE_DATA,recommendMatrix,searchType);
        

        const idMatrix = unsortedMatrix(recommendHM);

        heapSort(idMatrix);

        const top20recommendedLib = matrixToLib(idMatrix.slice(0,20));
        const row = new RowGen(20,null,'row',false);
        row.generateRowById(document.getElementsByClassName('subContentOne').item(0),Object.keys(top20recommendedLib),searchType,document.getElementById('profile-user').value,`Top Picks For ${document.getElementById('profile-user').value}`);
    

    }
   
  
    
    document.getElementsByClassName('genre--title').item(0).firstElementChild.textContent = GENRE;
    
    
    ROWGEN_INSTANCE.generateGenreRow(document.getElementsByClassName('subContentOne').item(0),document.getElementById('profile-user').value,GENRE,searchType,[1,6]);


}
// display in grid format
function gridMode(searchType,subCat = null)
{
    
    const hideNodes = Array.prototype.slice.call(document.getElementsByClassName('previewPanel'));
    const hideElabCards = Array.prototype.slice.call(document.getElementsByClassName('elaborateCard'));
    hideElabCards.map( x => x.remove());
    document.getElementsByClassName('tombStone-ctnr').item(0).remove();
    hideNodes.map(x => x.remove());
    document.getElementsByClassName('subContentOne').item(0).classList.remove('rowMode');
    document.getElementsByClassName('subContentOne').item(0).classList.add('gridMode');
    
    subCat ? displayCriteriaSubCat(nthChild(document.getElementsByClassName('viewHndle-optionPlchldr').item(0),1).textContent,searchType,subCat):displayCriteria(nthChild(document.getElementsByClassName('viewHndle-optionPlchldr').item(0),1).textContent,searchType);
    
   
}
function rowMode(searchType,subCat = null){
    
    const hideNodes = Array.prototype.slice.call(document.getElementsByClassName('previewPanel'));
    const hideElabCards = Array.prototype.slice.call(document.getElementsByClassName('elaborateCard'));
    document.getElementsByClassName('sugg-null')?.item(0)?.remove();
    hideElabCards.map( x => x.remove());
    hideNodes.map(x => x.remove());
    document.getElementsByClassName('subContentOne').item(0).classList.remove('gridMode');
    document.getElementsByClassName('subContentOne').item(0).classList.add('rowMode');
    subCat ? redisplayRowSubCat(searchType,subCat): redisplayRow(searchType);

    
    
}

// remove whitespaces and unwanted nodes from parent
function cleanNode(node)
{   
    let i = 0;
    while(i < node.childNodes.length){
        if(node.childNodes[i].nodeType == 8 || (node.childNodes[i].nodeType == 3 && !/\S/.test(node.childNodes[i].nodeValue))){
            node.removeChild(node.childNodes[i]);
            
        }
        else{
            i++;
        }
    }


}
// handle grid/row view toggle
function formatView(node)
{
    
    cleanNode(nthParent(node,1));
    const childNodes = Array.prototype.slice.call(nthParent(node,1).childNodes);
    const nodeIndex = childNodes.indexOf(node);
    var newInActive;
    nthParent(node,1).childNodes[nodeIndex + 2] ? newInActive = nthParent(node,1).childNodes[nodeIndex + 1] : newInActive = nthParent(node,1).childNodes[nodeIndex - 1];
    
    newInActive.classList.add(`${newInActive.className.split(' ')[0].split('V')[0]}InActive`);
    node.classList.remove(`${node.className.split(' ')[0].split('V')[0]}InActive`);
    nthParent(node,1).classList.contains('viewPrmtr-active') ? nthParent(node,1).classList.remove('viewPrmtr-active') : nthParent(node,1).classList.add('viewPrmtr-active');

}
// handle grid/row view toggle
export function displayFormat()
{
    

    const args = [].slice.call(arguments[0][0]);
    
    if(args[0].classList.contains(`${args[0].className.split(' ')[0].split('V')[0]}InActive`)){
        formatView(args[0]);

        if(args[0].className.split(' ')[0].split('V')[0] == 'grid'){
            if(args[2]){
                
                gridMode(args[1],args[2]);
            }
            else{
                gridMode(args[1]);
            }
        }
        else{
            if(args[2]){
                
                rowMode(args[1],args[2]);
            }
            else{
                rowMode(args[1]);

            }

        }

        

   }
    

    


}
document.getElementsByClassName('collapsed-navBar--ctnr').item(0).addEventListener('click', function(e){
    document.getElementsByClassName('cNavBar').item(0).classList.toggle('activated')
});
searchToggle();
profileListDropDown;
profileListDropDownOff;
window.onload = () =>{
    
    const SEARCH_INSTANCE = new Search('movie');
    SEARCH_INSTANCE.searchInputHandler(document.getElementsByClassName('searchInpt').item(0));
}


// variable properties registered to enable their animation 
/*CSS.registerProperty({
    name: '--hue',
    syntax: '<angle>',
    initialValue:'0deg',
    inherits:true

});

CSS.registerProperty({
    name: '--a',
    syntax:'<angle>',
    initialValue: '0deg',
    inherits:true
});

for(var i = 0; i< 12; i++){
    CSS.registerProperty({
        name: `--alpha${i}`,
        syntax: '<number>',
        initialValue: 0,
        inherits: true
    });
}*/
