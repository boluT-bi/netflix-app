import TMDB_interface from '../js/tmdbApiInterface.js';
import { addPushElement } from './auxiliaryFunctions.js';








export class MF
{
    constructor(data,alpha = 0.01,beta = 0.1 ,latentFeatureCount =2, iterations = 10000,error_limit = 0.001)
    {
        this.R = data;
        this.alpha = alpha;
        this.beta = beta;
        this.K = latentFeatureCount;
        this.threshold = error_limit;
        this.num_users = data.length;
        this.num_items = data[0].length;
        this.P = this.fillMatrix(this.num_users,this.K,()=>Math.random());
        this.Q = this.fillMatrix(this.num_items,this.K, ()=> Math.random());
        this.iterations = iterations;
        this.Qt = this.transposeMatrix(this.Q);
    }

    train()
    {
        let iter = this.iterations;
        var err;
        while(iter > 0)
        {
            this.sgd();
            err = this.calculateErr();
            if(err < this.threshold){
                break;
            }
            
            iter--;

        }
        return [this.P,this.transposeMatrix(this.Qt)];
        

    }

    columnVector(matrix, index){
        return matrix.map(m=>m[index]);
    }

    sgd()
    {
        for(var i =0; i < this.num_users; i++){
            for(var j = 0; j< this.num_items; j++){
                if(this.R[i][j] > 0){
                    var r_ij = this.dot(this.P[i],this.columnVector(this.Qt,j));
                    var eij = this.R[i][j] - r_ij;

                    for(var k =0; k < this.K; k++){
                        this.P[i][k] = this.P[i][k] + this.alpha*(2*eij*this.Qt[k][j] - (this.beta*this.P[i][k]));
                        this.Qt[k][j] = this.Qt[k][j] + this.alpha*(2*eij*this.P[i][k] - (this.beta*this.Qt[k][j]));
                    }

                }
            }
        }
        
    }
    calculateErr()
    {
        let e = 0;
        for(var i= 0; i<this.num_users; i++){
            for(var j= 0; j< this.num_items; j++){
                if(this.R[i][j]> 0){
                    e += Math.pow(this.R[i][j] - this.dot(this.P[i],this.columnVector(this.Qt,j)),2);

                    for(var k=0; k < this.k;k++){
                        e += beta/2*(Math.pow(this.P[i][k],2)+ Math.pow(this.Qt[k][j],2));
                    }

                }
            }
        }
        return e;
        
    }
    fillMatrix(n,k,fill = ()=>0)
    {
        let matrix = [];
        for(var i=0; i<n; i++){
            matrix.push([]);
            for(var j=0; j<k; j++){
                matrix[i][j] = fill();
            }
        }

        return matrix;
    }

    dot(n,m)
    {
        const transposedM = this.transposeMatrix(m);
        if(!this.isMatrix(n) && !this.isMatrix(m)){

            return this.dotVectors(n,m);
        }

        return n.map(i => transposedM.map(j => this.dotVectors(i,j)));

    }

    dotVectors(row,column)
    {
        return this.bimap(row,column,(x,y)=> x*y).reduce((sum,i)=> sum + i);
    }

    bimap(v,w,fn)
    {
        return v.map((item,i) => fn(item,w[i]));
    }

    fullMatrix(factors)
    {
        const [factor1,factor2]= factors;
        
        return this.dot(factor1,this.transposeMatrix(factor2));
    }

    transposeMatrix(matrix)
    {
        if(this.isMatrix(matrix)){
            const matrixProps= {
                rowL:matrix[0].length,
                columnL: matrix.length
                
            };
            const matrix_t =  this.fillMatrix(matrixProps.rowL,matrixProps.columnL,()=>0);
            
            
            return matrix_t.map((t,u)=> t.map((i,j)=>matrix[j][u]));
            
        }
        
        return matrix;
    }
    isMatrix(mtrx)
    {
        return Array.isArray(mtrx[0]);
    }

    
}




function findKeyIndex(mainDB)
{ 

    var x;
    for(var i =0,keys = Object.keys(mainDB);i< keys.length; i++){
        
        if(keys[i] == `${document.getElementById('profile-user').value}`){
            x = i;
        }
    }
    
    
    return x;


}

export function recommendSkel(data,d2,searchType)
{
    var x = findKeyIndex(data);
    const parseableData = {
        dataVar: data,
        parse: ()=>{
            const parsedData = JSON.parse(parseableData.dataVar[`${document.getElementById('profile-user').value}`]);
            return parsedData[`${searchType}`];
        }

    }
    const robustData = {
        dataVar: data[`${document.getElementById('profile-user').value}`],
        parse: null,
    }
   
   
    
    let secondaryHM;
    try{
        JSON.parse(data[`${document.getElementById('profile-user').value}`]);
        secondaryHM = parseableData.parse();

    } 
    catch(e){
        secondaryHM = robustData.dataVar;
    }
    
    const rowSkel = {};
    
    for(var j =0, subKeys = Object.keys(secondaryHM); j < subKeys.length - 1; j++){
       
        if(secondaryHM[subKeys[j]] == 0){
            rowSkel[subKeys[j]] = d2[x][j];
            



        }
    }
    return rowSkel;

    
}






//ranking system for the position of rows top to bottom
// sorting algorithm ? make rank a quantity
// sort left to right simple largest to smallest sort
function merge(arr,l,m,r)
{
    var n1 = m - l +1,
        n2 = r - m;

    var L = new Array(n1),
        R = new Array(n2);
    for(var i = 0; i< n1; i++){
        L[i] = arr[l+i];
    }
    for(var j = 0; j < n2; j++){
        R[j] = arr[m + 1 + j];
    }

    var i = 0,
        j = 0,
        k = 0;
    while( i < n1 && j < n2){
        if(L[i] > R[j]){
            arr[k] = L[i];
            i++;
        }
        else{
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while(i < n1){
        arr[k] = L[i];
        k++;
    }

    while(j < n2){
        arr[k] = R[j];
        k++;
    }

}

function mergeSort(arr, l,r)
{
    if(l>=r)
    {
        return;
    }
    var m = l + Math.floor((r-l)/2);
    mergeSort(arr,l,m);
    mergeSort(arr, m+1,r);
    merge(arr,l,m,r);


}

function heapify(arr,n,i)
{
    
    var largest = i;
   
    var l = 2*i + 1;
    var r = 2*i + 2;
    if(l < n && arr[largest][1] > arr[l][1] ){
        largest = l;
    }

    if(r < n && arr[largest][1] > arr[r][1] ){
        largest = r;
    }

    if(largest != i){
        var swap = arr[i];
        
        
        arr[i] = arr[largest];
        
        arr[largest] = swap;
        

        heapify(arr, n, largest);
    }
}

export function heapSort(arr)
{   
    
    var n = arr.length;
    for(var i = parseInt(n/2 -1); i >= 0; i--){
        heapify(arr,n,i);
    }
    
    
    for(var j = n-1; j >0; j--){
        var temp = arr[0];
        
        arr[0] = arr[j];
        
        arr[j] = temp;
        
        heapify(arr, j, 0);
    }
    

    
}


function horizontalSort(mtrx)
{
    for(var i = 0; i < mtrx.length; i++){
        heapSort(mtrx[i]);
    }
    return mtrx;
}

function mean(arr)
{
    return arr.reduce((sum,x) => sum + x)/arr.length;
}

function meanArr(mtrx)
{
    return mtrx.map((x,i) => mean(mtrx[i]));
    
    
}
function originalIndexHash(arr)
{
    var indexLib = {};
    for(var i = 0; i< arr.length; i++){
        indexLib[`${i}`] = arr[i];
    }

    return indexLib;
}

Node.prototype.appendChildren = function(){
    const args = [].slice.call(arguments);
    for(var i=0; i<args.length;i++){
        this.appendChild(args[i]);
    }
}




function median(arr)
{   
    var n = arr.length -1;
    if(n%2 != 0){
        var intN = parseInt(n/2);
        return (arr[intN] + arr[intN + 1])/2;

    }
    else{
        return arr[n/2];
    }
}






export default class RowGen extends TMDB_interface{
    constructor(horizontal_d = 20, tag = null, display = 'row', hasUrlRoute = true, numberedRow = false){

        super();
        this.tag = tag;
        this.horizontal_d = horizontal_d;
        this.genres = super.genres;
        this.reverseGenres = {'tv': { 28: 'Action',
                12: 'Adventure',
                16: 'Anime',
                35: 'Comedy',
                80: 'Crime',
                99:'Docuseries',
                18:'Drama',
                10751:'Family',
                14:'Fantasy',
                36:'History',
                27: 'Horror',
                10402:'Music',
                9648:'Mystery',
                10749: 'Romance',
                878: 'Sci-fi',
                53: 'Thriller',
                10752: 'War',
                37: 'Western'
            },
            'movie':{
                28: 'Action',
                12: 'Adventure',
                16: 'Anime',
                35: 'Comedy',
                80: 'Crime',
                99:'Documentary',
                18:'Drama',
                10751:'Family',
                14:'Fantasy',
                36:'History',
                27: 'Horror',
                10402:'Music',
                9648:'Mystery',
                10749: 'Romance',
                878: 'Sci-fi',
                53: 'Thriller',
                10752: 'War',
                37: 'Western'

            }
            
        }
        this.leftOffset = 19.1;
        this.display = display;
        this.hasUrlRoute = hasUrlRoute;
        
    }
    
    
    static assembleHeader(tag,searchType,genreDict)
    {
        
        const headerCtnr = document.createElement('div'),
            header = document.createElement('a'),
            
            arrCtnr = document.createElement('div'),
            
            arrwIndicator = document.createElement('i'),
            callToAct = document.createElement('p');
        
       
        
        
        header.className = 'tagHeader';
        if(genreDict[`${tag}`]){
            header.href = `/browse/genre/${genreDict[`${tag}`]}?bc=${searchType}`;
        }
        else{
            if(tag.split(' ')[1]){
                let spacedTag = tag.toLowerCase().split(' ');
                tag == 'My List' ? header.href = `/${spacedTag.join('-')}` :header.href = `/browse/${spacedTag.join('-')}?bc=${searchType}`;
            }
            else{
                header.href = `/browse/${tag.toLowerCase()}?bc=${searchType}`;
            }
        }

        header.textContent = tag;
        headerCtnr.className = 'tagCtnr';
        arrCtnr.className = 'expandTag';
        callToAct.textContent = 'Explore All';
        arrwIndicator.className = 'arr-chevron';
        header.appendChild(arrCtnr);
        arrCtnr.appendChildren(callToAct, arrwIndicator);
        headerCtnr.appendChild(header);


        return headerCtnr;




    }
    static assembleStaticHeader(tag)
    {
        const headerCtnr = document.createElement('div'),
            header = document.createElement('h2');
        
           
           
           
        header.className = 'tagHeader';
        header.textContent = tag;
        headerCtnr.className = 'tagCtnr';
        headerCtnr.appendChild(header);

        return headerCtnr;



            
    }
    
    static rowControls(node,pseudoNode,horizontal_d,leftOffset,searchType,...args)
    {

        
        const parentNode = document.createElement('div');
        const viceParentNode = document.createElement('div');
        
        const panelWidth = 97/100 * window.innerWidth;
        const itemWidth = leftOffset/100 * panelWidth;
        viceParentNode.className = 'prevObjectConveyor';
        viceParentNode.appendChild(pseudoNode);
        const btn1 = document.createElement('button');
        const icn1 = document.createElement('i');
        const icn2 = document.createElement('i');
        const btn2 = document.createElement('button');
        icn1.className = 'rightScroll--icon';
        btn1.className = 'ScrollRight';
        icn2.className = 'leftScroll--icon';
        btn2.className = 'ScrollLeft';
        btn1.appendChild(icn1);
        btn2.appendChild(icn2);
        parentNode.className = 'previewPanel';
        parentNode.appendChild(btn1);
        parentNode.appendChild(btn2);
        parentNode.appendChild(viceParentNode);
        
        node.appendChild(parentNode);
        const btn1Index = RowGen.getIndex(btn1);
        const btn2Index = RowGen.getIndex(btn2);
        btn1.id = `btn-row${btn1Index + 1}--right`;
        btn2.id = `btn-row${btn2Index + 1}--left`;
        btn1.value = '0';
        horizontal_d * itemWidth < panelWidth ? btn1.style.display = 'none': btn1.style.display = 'inline-block';
        btn2.style.display = 'none';
        btn2.addEventListener('click',specialCaseScroll);
        btn1.addEventListener('click',specialCaseScroll);
        

        const topVal = RowGen.getIndex(parentNode);
        parentNode.classList.add(`panel--${topVal+1}`);
        parentNode.setAttribute('data-activestatus', '0');
        
        if(topVal == 0){
            
            
            if(args[0] == 'grid'){
                    parentNode.style.marginTop = '30vh'
            }
            else{
                parentNode.style.marginTop = '-4vw';
                

            }
            
           
        }
       
        if(args[0] != 'grid'){
            if(args[1] && typeof args[1] == 'boolean'){
                
                let headerNode = RowGen.assembleHeader(args[0],searchType,args[2]);
                parentNode.appendChild(headerNode);
            }
            else{
                if(args[0]){
                    
                    let headerNode = RowGen.assembleStaticHeader(args[0]);
                    parentNode.appendChild(headerNode);
                }
                    
            }
        }
        
        parentNode.style.order = `${topVal + 2}`;
        parentNode.style.top = `3%`;
        const elaboDiv = RowGen.generateElaborateCard(topVal);
        node.append(elaboDiv);

    }
    async generateGenreRow(node,user,genre,searchType = 'tv',pageRange=null,page=1,...args)
    {
        super.searchType = searchType;
        const data = await super.searchTvByGenre(genre,pageRange,page);
        
    
        
        if(pageRange){

            RowGen.compressedDataHandler(node,data,this.horizontal_d,this.leftOffset,searchType,user,this.tag,this.hasUrlRoute,super.genres[`${searchType}`]);
        }
        else{
            RowGen.singleDataHandler(node,data,this.horizontal_d,this.leftOffset,searchType, user,this.hasUrlRoute,args[0],super.genres[`${searchType}`]);
        }
        
        
        
    }
    async generateCriteriaRow(node,user,criterium,searchType = 'tv',pageRange = null,page = 1, subCat = null){
        let data;
        
        subCat ? data =  await super.searchByCriteria(criterium,searchType,pageRange,page,subCat): data = await super.searchByCriteria(criterium,searchType,pageRange);
        
        RowGen.generateXItemRowResultFormat(node,data,this.leftOffset,searchType,user,this.display);
    }
    
    async generatePreLoadedData(node,user,horizontal_d,data,tag,mixStatus = true,searchType = null, numbered  = false)
    {
        mixStatus && numbered ? RowGen.singlePreLoadedDataHandle(node,data,user,horizontal_d,this.leftOffset,this.hasUrlRoute,tag,mixStatus,searchType,numbered): mixStatus ? RowGen.singlePreLoadedDataHandle(node,data,user,horizontal_d,this.leftOffset,this.hasUrlRoute,tag,mixStatus): RowGen.singlePreLoadedDataHandle(node,data,user,horizontal_d,this.leftOffset,this.hasUrlRoute,tag,mixStatus,searchType);
    }
    generatePreLoadGrid(node,user,horizontal_d,data,mixStatus = true, searchType = null)
    {
        mixStatus ? RowGen.multiRowPreLoadGen(node,user,this.leftOffset,horizontal_d,data,this.display,mixStatus): RowGen.multiRowPreLoadGen(node,user,this.leftOffset,horizontal_d,data,this.display,false,searchType);
    }

    static multiRowPreLoadGen(node,user,leftOffset,horizontal_d,data,display,mixStatus = true, searchType = null)
    {
        const feData = window.localStorage[`${user}`] || null;
        const panelWidth = 97/100 * window.innerWidth;
        const noItems = Math.floor(panelWidth/(19.1/100 * panelWidth));
        
        
        const docFrag = document.createDocumentFragment();
       
        for(var i = 0; i<horizontal_d;i++){
            if( i === 0 || i % noItems !== 0){
                var div = document.createElement('div');
            
                
                var img = document.createElement('img');
                div.className = 'prevObject';
                document.getElementsByTagName('img').namedItem(`${data[i].id}`)?img.id = `${data[i].id}#${Date.now()}`: img.id = `${data[i].id}`;
                
                if(mixStatus){
                    if(data[i]["media_type"]){
                    img.setAttribute('data-type', data[i]["media_type"]);
                    }
                    else{
                        img.setAttribute('data-type', data[i]["search_type_code"]);

                    }
                }
                else{    
                    img.setAttribute('data-type',searchType);
                }
                if(/[\.jpg\.png\.svg]$/.test(data[i].poster_path)){
                    img.src = `https://image.tmdb.org/t/p/w500${data[i].poster_path}`;
                }
                else{
                    
                    div.classList.add(data[i].poster_path);
                    img.style.visibility = 'hidden';
                    data[i].title ? div.setAttribute('data-title',data[i].title): div.setAttribute('data-title',data[i].name)
                } 
                if(feData){
                    const myList = JSON.parse(feData);
                    if(myList['isInMyList'][data[i].id] == 1){
                        div.setAttribute('data-inMyList', 'true');
                    }
                }
                
                div.style.left = `calc(${leftOffset}%*${i % noItems}`;
                img.addEventListener('click',displayCard);
                RowGen.panelElemPopUpFunc(div);
                //img.addEventListener('mouseleave', deactivatePopUp);
                
                div.setAttribute('data-rating','0');
               
            
                div.appendChild(img);
            
                
                
                docFrag.appendChild(div);
            }
            else{
                RowGen.rowControls(node,docFrag,noItems,leftOffset,searchType,display);
                var div = document.createElement('div');
            
                
                var img = document.createElement('img');
                div.className = 'prevObject';
                document.getElementsByTagName('img').namedItem(`${data[i].id}`)?img.id = `${data[i].id}#${Date.now()}`: img.id = `${data[i].id}`;
                
                if(mixStatus){
                    if(data[i]["media_type"]){
                    img.setAttribute('data-type', data[i]["media_type"]);
                    }
                    else{
                        img.setAttribute('data-type', data[i]["search_type_code"]);

                    }
                }
                else{    
                    img.setAttribute('data-type',searchType);
                }
                if(/[\.jpg\.png\.svg]$/.test(data[i].poster_path)){
                    img.src = `https://image.tmdb.org/t/p/w500${data[i].poster_path}`;
                }
                else{
                    
                    div.classList.add(data[i].poster_path);
                    img.style.visibility = 'hidden';
                    data[i].title ? div.setAttribute('data-title',data[i].title): div.setAttribute('data-title',data[i].name)
                } 
                if(feData){
                    const myList = JSON.parse(feData);
                    if(myList['isInMyList'][data[i].id] == 1){
                        div.setAttribute('data-inMyList', 'true');
                    }
                }
                
                div.style.left = `calc(${leftOffset}%*${i % noItems}`;
                img.addEventListener('click',displayCard);
                RowGen.panelElemPopUpFunc(div);
                //img.addEventListener('mouseleave', deactivatePopUp);
                
                div.setAttribute('data-rating','0');
               
            
                div.appendChild(img);
            
                
                
                docFrag.appendChild(div);

            }
               


        }
        if(docFrag.childNodes.length){
            RowGen.rowControls(node,docFrag,noItems,leftOffset,searchType,display);
        }
       
        
        

    }
    static singlePreLoadedDataHandle(node,data,user,horizontal_d,leftOffset,hasUrlRoute,tag,mixStatus = true,searchType = null, numbered = false)
    {
        const feData = window.localStorage[`${user}`] || null;
        const singleData = data;
        
        const panelHeight = 30/100 * window.innerHeight;
        const docFrag = document.createDocumentFragment();
        for(var i = 0; i<horizontal_d;i++){
            var div = document.createElement('div');
           
            
            var img = document.createElement('img');
            div.className = 'prevObject';
            document.getElementsByTagName('img').namedItem(`${singleData["results"][i].id}`)?img.id = `${singleData["results"][i].id}#${Date.now()}`: img.id = `${singleData["results"][i].id}`;
            
            if(mixStatus){
                if(singleData["results"][i]["media_type"]){
                 img.setAttribute('data-type', singleData["results"][i]["media_type"]);
                }
                else{
                    img.setAttribute('data-type', singleData["results"][i]["search_type_code"]);

                }
            }
            else{    
                img.setAttribute('data-type',searchType);
            }
            if(/[\.jpg\.png\.svg]$/.test(singleData["results"][i].poster_path)){
                img.src = `https://image.tmdb.org/t/p/w500${singleData["results"][i].poster_path}`;
            }
            else{
                
                div.classList.add(singleData["results"][i].poster_path);
                img.style.visibility = 'hidden';
                singleData["results"][i].title ? div.setAttribute('data-title',singleData["results"][i].title): div.setAttribute('data-title',singleData["results"][i].name)
            } 
            if(feData){
                const myList = JSON.parse(feData);
                if(myList['isInMyList'][`${singleData["results"][i].id}`] == 1){
                    div.setAttribute('data-inMyList', 'true');
                }
            }
            
            div.style.left = `calc(${leftOffset}%*${i % horizontal_d}`;
            img.addEventListener('click',displayCard);
            RowGen.panelElemPopUpFunc(div);
            //img.addEventListener('mouseleave', deactivatePopUp);
            
            div.setAttribute('data-rating','0');
            if(numbered){
                let numberCtnr = document.createElement('div');
                let number = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                let numberStyling = document.createElementNS('http://www.w3.org/2000/svg','path');
                number.setAttributeNS(null, 'viewbox', `${document.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'symbol').namedItem(`rank-${i + 1}`).getAttribute('viewBox')}`);
                numberStyling.setAttributeNS(null, 'd', `${document.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'symbol').namedItem(`rank-${i + 1}`).firstElementChild.getAttribute('d')}`);
                
                numberCtnr.className = 'numberedPrevObject';
                number.appendChild(numberStyling);
                numberCtnr.appendChild(number);
                div.appendChild(numberCtnr)
            }
            div.appendChild(img);
            
            
            docFrag.appendChild(div);
            


        }
        RowGen.rowControls(node,docFrag,horizontal_d,leftOffset,searchType,tag,hasUrlRoute,numbered);

    }


    async generatePopularRow(node,user,searchType = 'tv',pageRange=null,page=1,tag)
    { 
        super.searchType = searchType;
    
        const data = await super.searchPopularTitles(pageRange,page);
        
        if(pageRange){
            
            RowGen.compressedDataHandler(node,data,this.horizontal_d,this.leftOffset,searchType, user,null,this.hasUrlRoute,super.genres[`${searchType}`]);
        }
        else{
            RowGen.singleDataHandler(node,data,this.horizontal_d,this.leftOffset,searchType, user,this.hasUrlRoute,tag,super.genres[`${searchType}`]);
        }
        
        
        
    }
    async generatePopularRowGrid(node,user,searchType='tv',pageRange){
        super.searchType = searchType;
        const data = await super.searchPopularTitles(pageRange);
        RowGen.generateXItemRowResultFormat(node,data,this.leftOffset,searchType,user,this.display);
    }
    static idDataHandler(node,data,horizontal_d,leftOffset,searchType, user,tag,hasUrlRoute,...args)
    {
        let singleData = data;
        
        const feData = window.localStorage[`${user}`] || null;
        
        let docFrag = document.createDocumentFragment();
        for( var i =0; i < singleData.length; i++){
        
            var div = document.createElement('div');
            var img = document.createElement('img');
            
            document.getElementsByTagName('img').namedItem(`${singleData[i].id}`)?img.id = `${singleData[i].id}#${Date.now()}`: img.id = `${singleData[i].id}`;
            if(/[\.jpg\.png\.svg]$/.test(singleData[i].poster_path)){
                img.src = `https://image.tmdb.org/t/p/w500${singleData[i].poster_path}`;
            }
            else{
                div.classList.add(singleData[i].poster_path);
                img.style.visibility = 'hidden';
                singleData[i].title ? div.setAttribute('data-title',singleData[i].title): div.setAttribute('data-title',singleData[i].name)
            }
            img.setAttribute('data-type',searchType);
            div.className = 'prevObject';
            div.style.left = `calc(${leftOffset}%*${i % singleData.length})`;
            img.addEventListener('click',displayCard);
            RowGen.panelElemPopUpFunc(div);
            if(feData){
                const myList = JSON.parse(feData);
                if(myList['isInMyList'][singleData[i].id] == 1){
                    div.setAttribute('data-inMyList', 'true');
                }
            }
            div.setAttribute('data-rating','0');
            div.appendChild(img);
            
            docFrag.appendChild(div);


        }
        RowGen.rowControls(node,docFrag,singleData.length,leftOffset,searchType,tag,hasUrlRoute,args[0]);
    }
    async generateRowById(node,id,searchType = 'tv', user,tag = null)
    { 
        
        super.searchType = searchType;
        let data = await super.searchById(id);
        if(!Array.isArray(data)){
            data = [data];
        }
        this.display == 'grid' ? RowGen.generateXItemRow(node,data,this.leftOffset,searchType,user, this.display):RowGen.idDataHandler(node,data,this.horizontal_d,this.leftOffset,searchType,user,tag,this.hasUrlRoute,super.genres[`${searchType}`]);

    }
    static generateXItemRowResultFormat(node,data,leftOffset,searchType,user,display){
        const massData = RowGen.compressedData(data);
        const panelWidth = 97/100 * window.innerWidth;
        const noItems = Math.round(panelWidth/(panelWidth * (leftOffset + 3)/100));

        const myListData = window.localStorage[`${user}`] || null;
       
        let docFrag = new DocumentFragment();
        
        
       
        var z = 0;
        
        for(var y = 0; y < massData[massData.length - 1].length; y++){ 
            if(y == 0 || y % noItems != 0){
                var div = document.createElement('div');
                var img = document.createElement('img');
                div.className = 'prevObject';
                
                document.getElementsByTagName('img').namedItem(`${massData[z]["results"][y % massData[z]["results"].length ].id}`)?img.id = `${massData[z]["results"][y % massData[z]["results"].length ].id}#${Date.now()}`: img.id = `${massData[z]["results"][y % massData[z]["results"].length ].id}`;
                if(/[\.jpg\.png\.svg]$/.test(massData[z]["results"][y % massData[z]["results"].length].poster_path)){
                    img.src = `https://image.tmdb.org/t/p/w500${massData[z]["results"][y % massData[z]["results"].length].poster_path}`;
                }
                else{
                    
                    div.classList.add(massData[z]["results"][y % massData[z]["results"].length].poster_path);
                    img.style.visibility = 'hidden';
                    massData[z]["results"][y % massData[z]["results"].length].title ? div.setAttribute('data-title',massData[z]["results"][y % massData[z]["results"].length].title): div.setAttribute('data-title',massData[z]["results"][y % massData[z]["results"].length].name)
                }
                img.setAttribute('data-type',searchType);
                
                div.style.left = `calc(${leftOffset}%*${y % noItems})`;
                img.addEventListener('click',displayCard);
                RowGen.panelElemPopUpFunc(div);
                if(myListData){
                    const myList = JSON.parse(myListData);
                    if(myList['isInMyList'][`${massData[z]["results"][y % massData[z]["results"].length].id}`] == 1){
                        div.setAttribute('data-inMyList', 'true');
                    }
                }
                div.setAttribute('data-rating','0');
                div.appendChild(img);
                docFrag.appendChild(div);
                
                
                
                
                
                

            }
            else{
                
              
                RowGen.rowControls(node,docFrag,noItems,leftOffset,searchType,display);

                
                
                var div = document.createElement('div');
                var img = document.createElement('img');
                div.className = 'prevObject';
                document.getElementsByTagName('img').namedItem(`${massData[z]["results"][y % massData[z]["results"].length ].id}`)?img.id = `${massData[z]["results"][y % massData[z]["results"].length ].id}#${Date.now()}`: img.id = `${massData[z]["results"][y % massData[z]["results"].length ].id}`;
                if(/[\.jpg\.png\.svg]$/.test(massData[z]["results"][y % massData[z]["results"].length].poster_path)){
                    img.src = `https://image.tmdb.org/t/p/w500${massData[z]["results"][y % massData[z]["results"].length].poster_path}`;
                }
                else{
                    div.classList.add(massData[z]["results"][y % massData[z]["results"].length].poster_path);
                    img.style.visibility = 'hidden';
                    massData[z]["results"][y % massData[z]["results"].length].title ? div.setAttribute('data-title',massData[z]["results"][y % massData[z]["results"].length].title): div.setAttribute('data-title',massData[z]["results"][y % massData[z]["results"].length].name);
                    
                }                
                img.setAttribute('data-type',searchType);
              
                div.style.left = `calc(${leftOffset}%*${y % noItems})`;
                img.addEventListener('click',displayCard);
                RowGen.panelElemPopUpFunc(div);
                if(myListData){
                    const myList = JSON.parse(myListData);
                    if(myList['isInMyList'][`${massData[z]["results"][y % massData[z]["results"].length].id}`] == 1){
                        div.setAttribute('data-inMyList', 'true');
                    }
                }
                div.setAttribute('data-rating','0');
                div.appendChild(img);
                
                docFrag.appendChild(div);
                


            }
            if(y % massData[z]["results"].length == 0 && y != 0){
                z += 1;

            }
        }
        
        
    
    }
    static panelElemPopUpFunc(elem,...args)
    {
        
        var timeOut = null;
        elem.onmouseover = function(){
            timeOut = setTimeout(function(){
                return activatePopUp(elem);
            },820);
        };
        elem.onmouseout = function(){
            
            clearTimeout(timeOut);
            

        }
    }
    

    static singleDataHandler(node,data,horizontal_d,leftOffset,searchType,user,hasUrlRoute,tag,...args)
    {
        const singleData = data;
        const feData = window.localStorage[`${user}`] || null;
        
        const docFrag = document.createDocumentFragment();
        for(var i = 0; i< data["results"].length;i++){
            var div = document.createElement('div');
            
            
            var img = document.createElement('img');
            div.className = 'prevObject';
            document.getElementsByTagName('img').namedItem(`${singleData["results"][i].id}`)?img.id = `${singleData["results"][i].id}#${Date.now()}`: img.id = `${singleData["results"][i].id}`;
            
            img.setAttribute('data-type',searchType);
            if(/[\.jpg\.png\.svg]$/.test(data["results"][i].poster_path)){
                img.src = `https://image.tmdb.org/t/p/w500${singleData["results"][i].poster_path}`;
            }
            else{
                div.classList.add(data["results"][i].poster_path);
                img.style.visibility = 'hidden';
                singleData["results"][i].title ? div.setAttribute('data-title',singleData["results"][i].title): div.setAttribute('data-title',singleData["results"][i].name);
            }            
            if(feData){
                const myList = JSON.parse(feData);
                if(myList['isInMyList'][singleData["results"][i].id] == 1){
                    div.setAttribute('data-inMyList', 'true');
                }
            }
            
            div.style.left = `calc(${leftOffset}%*${i % singleData["results"].length}`;
            img.addEventListener('click',displayCard);
            RowGen.panelElemPopUpFunc(div);
            //img.addEventListener('mouseleave', deactivatePopUp);
            
            div.setAttribute('data-rating','0');
            div.appendChild(img);
            
            
            docFrag.appendChild(div);
            


        }
        RowGen.rowControls(node,docFrag,singleData["results"].length,leftOffset,searchType,tag,hasUrlRoute,args[0]);

    }
    static getIndex(node)
    {
        const nodeList = [].slice.call(document.getElementsByClassName(node.className));
        
        for(var i =0; i< nodeList.length; i++){
            if(node == nodeList[i]){
                return i;
            }
        }

    }
    static compressedData(data)
    {
        let dataLst = data[0]["results"].slice();
        
        
        for(var i = 1; i < data.length;i++){
            dataLst = dataLst.concat(data[i]["results"]);
            

        }
        
        data.push(dataLst);
        return data;
        

    }

    static compressedDataHandler(node,data,horizontal_d, leftOffset,searchType,user,tag = null, hasUrlRoute,...args){
        const massData = RowGen.compressedData(data);
        const feData = window.localStorage[`${user}`];
        const docFrag = document.createDocumentFragment();
        let z = 0;
        for(var i = 0;i < massData[massData.length -1].length; i++){
            if(i == 0 ||i % horizontal_d != 0){
                var div = document.createElement('div'),
                   
                    img = document.createElement('img');

                div.className = 'prevObject';
                if(/[\.jpg\.png\.svg]$/.test(massData[z]["results"][i % horizontal_d].poster_path)){
                    img.src = `https://image.tmdb.org/t/p/w500${massData[z]["results"][i % horizontal_d].poster_path}`;
                }
                else{
                    div.classList.add(massData[z]["results"][i % horizontal_d].poster_path);
                    img.style.visibility = 'hidden';
                    massData[z]["results"][i % horizontal_d].title ? div.setAttribute('data-title',massData[z]["results"][i % horizontal_d].title): div.setAttribute('data-title',massData[z]["results"][i % horizontal_d].name)
                }                 
                    
                document.getElementsByTagName('img').namedItem(`${massData[z]["results"][i % horizontal_d].id}`)?img.id = `${massData[z]["results"][i % horizontal_d].id}#${Date.now()}`: img.id = `${massData[z]["results"][i % horizontal_d].id}`;
                if(feData){
                    const myList = JSON.parse(feData);
                    if(myList['isInMyList'][`${massData[z]["results"][i % horizontal_d].id}`] == 1){
                        div.setAttribute('data-inMyList', 'true');
                    }
                }
               
                
                
                img.setAttribute('data-type',searchType);
                div.setAttribute('data-rating', '0');
                div.style.left = `calc(${i % horizontal_d} * ${leftOffset}%)`;
                img.addEventListener('click', displayCard);
                RowGen.panelElemPopUpFunc(div);
                

                div.appendChild(img);
                
                
                docFrag.appendChild(div);

                


            }
            else{
                RowGen.rowControls(node,docFrag,horizontal_d,leftOffset,searchType,tag,hasUrlRoute, args[0]);
                z += 1;
                var div = document.createElement('div'),
                   
                    img = document.createElement('img');
                
                div.className = 'prevObject';
                if(/[\.jpg\.png\.svg]$/.test(massData[z]["results"][i % horizontal_d].poster_path)){
                    img.src = `https://image.tmdb.org/t/p/w500${massData[z]["results"][i % horizontal_d].poster_path}`;
                }
                else{
                    div.classList.add(massData[z]["results"][i %horizontal_d].poster_path);
                    img.style.visibility = 'hidden';
                    massData[z]["results"][i % horizontal_d].title ? div.setAttribute('data-title',massData[z]["results"][i%horizontal_d].title): div.setAttribute('data-title',massData[z]["results"][i % horizontal_d].name)
                } 
                img.id = data[z]["results"][i%horizontal_d].id;
                
               
                img.setAttribute('data-type',searchType);
                div.setAttribute('data-rating', '0');
                if(feData){
                    const myList = JSON.parse(feData);
                    if(myList['isInMyList'][`${massData[z]["results"][i % horizontal_d].id}`] == 1){
                        div.setAttribute('data-inMyList', 'true');
                    }
                }
                div.style.left = `calc(${i % horizontal_d} * ${leftOffset}%)`;
                
                img.addEventListener('click', displayCard);
                RowGen.panelElemPopUpFunc(div);
                
                div.appendChild(img)
               
                
                docFrag.appendChild(div);

            }
            
        }
        
        
        
    }
    static generateElaborateCard(index)
    {
        const elabDiv = document.createElement('div');
        const elabDivP = document.createElement('div');
        const elabDivI = document.createElement('div');
        const header = document.createElement('h2');
        const abrInfo = document.createElement('div')
        const para1 = document.createElement('p');
        const para2 = document.createElement('p');
        const para3 = document.createElement('p');
        const btnDiv = document.createElement('div');
        const btnPlay = document.createElement('div');
        const btnMyList = document.createElement('div');
        const btnPlayPlcHldr = document.createElement('p');
        const btnMyListPlcHldr = document.createElement('p');
        const elabDivRS = document.createElement('div');
        const plyBtnIcn = document.createElement('i');
        const myListBtnIcn1 = document.createElement('i');
        const myListBtnIcn2 = document.createElement('i');
        const iconContainer = document.createElement('div');
        const extBtnIcn1 = document.createElement('i');
        const extBtnIcn2 = document.createElement('i');
        const ExtBtn = document.createElement('div');
        iconContainer.className = 'myListIcn-ctnr';
        ExtBtn.className = 'elab-extBtn'
        ExtBtn.appendChildren(extBtnIcn1,extBtnIcn2);
        btnPlayPlcHldr.textContent = 'PLAY';
        btnMyListPlcHldr.textContent = 'MY LIST';
        btnDiv.className = 'elab-info--btnDiv';
        btnPlay.className = 'btnDiv--ply';
        btnMyList.className = 'btnDiv--myList';
        btnMyList.addEventListener('click', elabMyListHandle);
        myListBtnIcn1.className = 'myListIcn--1';
        myListBtnIcn2.className = 'myListIcn--2';
        iconContainer.appendChildren(myListBtnIcn1,myListBtnIcn2);
        btnPlay.appendChildren(plyBtnIcn,btnPlayPlcHldr);
        btnMyList.appendChildren(iconContainer, btnMyListPlcHldr);
        btnDiv.appendChildren(btnPlay,btnMyList);
        elabDiv.className = 'elaborateCard';
        elabDivP.className = 'elaborateCard--placeholder';
        elabDivI.className = 'elaborateCard--info';
        elabDivRS.className = 'ratingSystem';
        elabDiv.style.display = 'none';
        const starLib = {};
        const docFrag = document.createDocumentFragment();
        for(var i = 1; i <= 5; i++){
            starLib[`star--${i}`] = document.createElementNS('http://www.w3.org/2000/svg','svg');
            starLib[`path--${i}`] = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            starLib[`star--${i}`].classList.add(`star--${i}`);
            if(i == 1){
                starLib[`star--${i}`].classList.add('ratingSystem--item');
            }
            else{
                starLib[`star--${i}`].classList.add('ratingSystem--item');
                starLib[`star--${i}`].classList.add('additional--items');

            }
            starLib[`path--${i}`].setAttributeNS( null,'d',
             'M 0 6 L 6 6 L 10 0 L 14 6 L 20 6 L 16 12 L 20 20 L 10 15 L 0 20 L 4 12 L 0 6');
            starLib[`star--${i}`].setAttributeNS(null,'viewbox','0 0 20 20');
            starLib[`path--${i}`].id = 'stars';
            starLib[`star--${i}`].appendChild(starLib[`path--${i}`]);
            docFrag.appendChild(starLib[`star--${i}`]);




        }
        abrInfo.className = 'elab-info--abrInfo'
        para2.className = 'elab-info--cast';
        para3.className = 'elab-info--genres';
        ExtBtn.addEventListener('click', hideCard);
        elabDivI.appendChildren(header,abrInfo,para1,btnDiv);
        elabDivRS.appendChild(docFrag);
        elabDivP.appendChild(ExtBtn);
        RowGen.nestAppend(elabDiv,elabDivP,elabDivI);
        
        elabDivI.appendChildren(elabDivRS,para2,para3);
        
        elabDiv.style.top = `calc(${document.getElementsByClassName('previewPanel').item(index).offsetTop}px + ${document.getElementsByClassName('previewPanel').item(index).clientHeight}px + 30px)`;

        return elabDiv;

    }
    static nestAppend()
    {
        const args = [].slice.call(arguments);
        for(var x = 0; x<args.length; x++){
            if(args[x-1]){
                args[x-1].appendChild(args[x]);
            }
        }
    }
    static  generateXItemRow(node,data,leftOffset,searchType,user,display)
    {
        
        const massData = data;
       
        const panelWidth = 97/100 * window.innerWidth;
        const noItems = Math.round(panelWidth/(panelWidth *(leftOffset + 3)/100));
        const myListData = window.localStorage[`${user}`] || null;
        const docFrag = document.createDocumentFragment();
        var z = 0;
        for(var i = 0; i < massData.length; i++){
            if( i == 0 || i%noItems != 0){
                
                var div = document.createElement('div');
                var img = document.createElement('img');
            
                document.getElementsByTagName('img').namedItem(`${massData[i].id}`)?img.id = `${massData[i].id}#${Date.now()}`: img.id = `${massData[i].id}`;
                div.className = 'prevObject';
                if(/[\.jpg\.png\.svg]$/.test(massData[i].poster_path)){
                    img.src = `https://image.tmdb.org/t/p/w500${massData[i].poster_path}`;
                }
                else{
                    div.classList.add(massData[i].poster_path);
                    img.style.visibility = 'hidden';
                    massData[i].title ? div.setAttribute('data-title',massData[i].title): div.setAttribute('data-title',massData[i].name)
                } 
                img.setAttribute('data-type',searchType);
                
                div.style.left = `calc(${leftOffset}%*${i % noItems})`;
                img.addEventListener('click',displayCard);
                RowGen.panelElemPopUpFunc(div);
                if(myListData){
                    const myList = JSON.parse(myListData);
                    if(myList['isInMyList'][massData[i].id] == 1){
                        div.setAttribute('data-inMyList', 'true');
                    }
                }
                div.setAttribute('data-rating','0');
                div.appendChild(img);

                docFrag.appendChild(div);
            }
            else{
                RowGen.rowControls(node,docFrag,noItems,leftOffset,searchType, display);
                
                var div = document.createElement('div');
                var img = document.createElement('img');
            
                document.getElementsByTagName('img').namedItem(`${massData[i].id}`)?img.id = `${massData[i].id}#${Date.now()}`: img.id = `${massData[i].id}`;
                div.className = 'prevObject';
                if(/[\.jpg\.png\.svg]$/.test(massData[i].poster_path)){
                    img.src = `https://image.tmdb.org/t/p/w500${massData[i].poster_path}`;
                }
                else{
                    img.classList.add(massData[i].poster_path);
                    img.setAttribute('data-title', massData[i].title);
                } 
                img.setAttribute('data-type',searchType);
                
                div.style.left = `calc(${leftOffset}%*${i % noItems})`;
                img.addEventListener('click',displayCard);
                RowGen.panelElemPopUpFunc(div);
                if(myListData){
                    const myList = JSON.parse(myListData);
                    if(myList['isInMyList'][massData[i].id] == 1){
                        div.setAttribute('data-inMyList', 'true');
                    }
                }
                div.setAttribute('data-rating','0');
                div.appendChild(img);

                docFrag.appendChild(div);
            }

            

        }


    }
    generateGenreTags(x,searchType)
    {
        
        
        const lib = super.genres[`${searchType}`];
        let cachedGenreLib = {};
        let genreLst = [];
        for(var i = 0; i < x; i++){
            
            var genreItm = Object.keys(lib)[Math.floor(Math.random()*Object.keys(lib).length)];
            if(!cachedGenreLib[`${genreItm}`]){
                cachedGenreLib[`${genreItm}`] = true;
                genreLst.push(genreItm);
            }
            else{
                i--;
            }

        }

        return genreLst;
    }   
}

export class PageGen extends RowGen{
    constructor(vertical_d = 2){
        super();
        this.vertical_d = vertical_d;
        
        

        
    }
   
    async generatePopularPage(node, user, searchType = 'tv', pageRange=[1,this.vertical_d])
    {
        
        
        super.generatePopularRow(node, user,searchType,pageRange,tag);
        

    }
    async generateGenrePage(node,user, genre,searchType = 'tv',pageRange = [1,this.vertical_d])
    {
        
        super.generateGenreRow(node,genre,searchType,pageRange, user);
    }
    static fillMatrix(x,y,fn = ()=> 0)
    {
        let mtrx = [];
        for(var i = 0; i< x; i++)
        {
            mtrx.push([]);
            for(var j=0; j < y; j++){
                mtrx[i][j] = fn();
            }
        }
        return mtrx;

    }
    async generateIdPage(node,user,id,searchType = null,tag=null,mixStatus = false)
    {
        super.display = 'grid';
        mixStatus ? super.generateRowById(node,id,user,mixStatus): super.generateRowById(node,id,searchType,user);
    }
    async generatePageByCriteria(node,user,criteria,searchType,pageRange = null,page =1,subCat =null)
    {
        super.display = 'grid';
        super.generateCriteriaRow(node,user,criteria,searchType,pageRange,page,subCat);
    }
    async generatePopularPageGrid(node,user,searchType = 'tv', pageRange = [1,this.vertical_d]){
        super.display = 'grid';
        super.generatePopularRowGrid(node,user,searchType,pageRange);
    }
    async preLoadDtaPage(node,user,horizontal_d,data,mixStatus = true,searchType = null)
    {
        super.display = 'grid';
        mixStatus ? super.generatePreLoadGrid(node,user,horizontal_d,data,mixStatus): super.generatePreLoadGrid(node,user,horizontal_d,data,false,searchType);
    }
    


}



export function unsortedMatrix(lib){

     
    let keys = Object.keys(lib),
        length = Object.keys(lib).length;

    let matrx = [];
    for(var i = 0, kk = length; i < kk; i++){
        matrx.push([keys[i],lib[keys[i]]]);
    }
    return matrx;

}
const MIN_RUNS = 32;
function minRuns(n){
    let r = 0;
    while(n >= MIN_RUNS){
        r |= (n & 1);
        n >>= 1;
    }
    return n + r;
}

function insertionSort(mtrx, left, right)
{
    for(var i = left + 1; i < right + 1; i++){
        var key = mtrx[i][1];
        var j = i - 1;
        while( j>=0 && mtrx[j][1] > key){
            var temp = mtrx[j+1][1];
            mtrx[j+1][1] = mtrx[j][1];
            mtrx[j][1] = temp;
            j --;
        }
    }
    
}

function libMerge(mtrx, l, m ,r)
{
    var len1 = m - l + 1,
        len2 = r - m;
    var L = new Array(len1),
        R = new Array(len2);
    for(var x = 0; x < len1; x++){
        L[x] = mtrx[l + x];
        
    }
    for(var y =0; y < len2; y++){
        R[y] = mtrx[m + 1 + y];
    }

    var i= 0,
        j=0,
        k=l;
    while(i<len1 && j < len2){
        if(L[i][1] <= R[j][1]){
            mtrx[k] = L[i];
            i++;
        }
        else{
            mtrx[k] = R[j];
            j ++;
        }
        k++;
    }
    while(i < len1){
        mtrx[k] = L[i];
        i++;
        k++;
    }
    while(j < len2){
        mtrx[k] = R[j];
        j++;
        k++;
    }
}

export function timSort(mtrx)
{
    let n = mtrx.length;
    let minRun = minRuns(n);
    
    for(var l = 0; l < n; l+=minRun){
        var r = Math.min((l + minRun - 1),( n-1));
        insertionSort(mtrx,l,r);
    }

    
    for(var size = minRun;size < n; size = 2*size){

        for(var left = 0; left < n; left += 2*size){
            var mid = left + size - 1;
            var right = Math.min((left + 2*size -1),(n-1));

            if(mid < right){
                libMerge(mtrx,left,mid,right);
            }
        }

        
    }
}















  
  













