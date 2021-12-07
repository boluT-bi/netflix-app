


const API_KEY = 'faf9f1a7200447079dd513898ac80175';
export default class TMDB_interface{
    constructor(id = null,searchType = 'tv',apiKey = API_KEY, lang = 'en_us'){
        this.id = id;
        this.apiKey = apiKey;
        this.baseURI = {
            tv: 'https://api.themoviedb.org/3/tv/',
            image: 'https://image.tmdb.org/t/p/', 
            mainBase:'https://api.themoviedb.org/3/',
            movie:'https://api.themoviedb.org/3/movie/',
            search: 'https://api.themoviedb.org/3/search/',
            
            
        };
        this.language = lang;
        this.searchType = searchType;

        this.searchConfig = {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        };
        TMDB_interface.prototype.genres = { 'tv':{
                'Action & Adventure':[28,12],
                'Anime': 16,
                'Comedy': 35,
                'Crime': 80,
                'Docuseries':99,
                'Drama':18,
                'Family': 10751,
                'Fantasy': 14,
                'History': 36,
                'Horror': 27,
                'Music': 10402,
                'Mystery': 9648,
                'Romance': 10749,
                'Sci-fi':878,
                'Thriller':53,
                'War': 10752,
                'Western': 37
            },
            'movie':{
                'Action & Adventure':[28,12],
                'Anime': 16,
                'Comedy': 35,
                'Crime': 80,
                'Documentary':99,
                'Drama':18,
                'Family': 10751,
                'Fantasy': 14,
                'History': 36,
                'Horror': 27,
                'Music': 10402,
                'Mystery': 9648,
                'Romance': 10749,
                'Sci-fi':878,
                'Thriller':53,
                'War': 10752,
                'Western': 37

            }

        };


    }


    async searchTvByGenre(genre,pageRange=null,page=1,)
    {
        const baseURI = this.baseURI.mainBase;
        const searchConfig = this.searchConfig;
        let url;
        
        if(!pageRange){
           
            url = TMDB_interface.urlConstructor(baseURI, this.apiKey,this.language,genre,this.searchType,page, this.genres,this.baseURI);
            
            return await TMDB_interface.singleFetch(url,searchConfig);
        
        }
        else{
            
            url = TMDB_interface.urlConstructor(baseURI, this.apiKey,this.language,genre,this.searchType,pageRange,this.genres,this.baseURI);
           
            return await TMDB_interface.fetchMultiple(url,searchConfig);
            
           
        }

       
        
        
        

    }
   
    async searchPopularTitles(pageRange=null,page=1)
    {
        const baseURI = this.baseURI.mainBase;
        
        const searchConfig = this.searchConfig;
        const genre = 'popular';
        var url;
        if(pageRange){
           
            url = TMDB_interface.urlConstructor(baseURI,this.apiKey,this.language,genre,this.searchType,pageRange,this.baseURI);
            
            return await TMDB_interface.fetchMultiple(url,searchConfig);
            
            
        
            
        }
        else{
            url = TMDB_interface.urlConstructor(baseURI,this.apiKey,this.language,genre,this.searchType,page,this.baseURI);
            
            return await TMDB_interface.singleFetch(url,searchConfig);
        }
        

    }
    async searchCast(id = this.id, searchType = this.searchType)
    {   
        
        var metaType = 'credits';
        const searchConfig = this.searchConfig;
        var baseURI;
        searchType == 'tv' ? baseURI = this.baseURI.tv : baseURI = this.baseURI.movie;
        var url = TMDB_interface.urlConstructor(baseURI,this.apiKey,this.language,metaType,id,searchType,this.baseURI);
        
        return await TMDB_interface.creditsFetch(url,searchConfig);

    }
    async searchUpcoming(page=1)
    {   if(!Array.isArray(page)){
            const url = this.baseURI.movie + `upcoming?api_key=${this.apiKey}&language=${this.language}&page=${page}`;
            return await TMDB_interface.singleFetch(url,this.searchConfig);
        }
        else{
            const url = [];
            for(var i = page[0]; i <= page[1]; i++){
                let urlItem = this.baseURI.movie + `upcoming?api_key=${this.apiKey}&page=${i}&language=${this.language}`;
                url.push(urlItem);

            }
            return await TMDB_interface.fetchMultiple(url,this.searchConfig);
        }
    }
    async searchTrending(searchType = this.searchType)
    {
        const url = this.baseURI.mainBase + `trending/all/day?api_key=${this.apiKey}`;
        return await TMDB_interface.singleFetch(url,this.searchConfig);

        
    }
    async searchNewReleases(searchType = this.searchType)
    {
        const url = this.baseURI.mainBase + 'discover/' + `${searchType}?api_key=${this.apiKey}&sort_by=popularity.desc&release_date.gte=2021&page=2&language=${this.language}`;

        return await TMDB_interface.singleFetch(url,this.searchConfig);
    }
    async searchByCriteria(criterium,searchType = 'tv',pageRange = null,page=1,subCat=null)
    {
        const searchConfig = this.searchConfig;
        let baseURI;
       
        subCat ? baseURI = this.baseURI.mainBase: baseURI = this.baseURI.search;
        let url;
        if(criterium == 'A-Z'){
            if(subCat){
                url = TMDB_interface.urlConstructor(baseURI,this.apiKey,this.language,'original_title.asc',pageRange,this.genres,subCat,searchType,this.baseURI);
            }
            else{
                var letArr = [];
                for(var i = 0; i < 26; i++){
                    var dec = 65 + i;
                    letArr.push(String.fromCharCode(dec));
                    

                }
                url = TMDB_interface.urlConstructor(baseURI,this.apiKey,this.language,letArr,page,searchType,this.baseURI);
            }
            return await TMDB_interface.fetchMultiple(url,searchConfig);  

        }
        if(criterium == 'Z-A'){
            if(subCat){
                
                url = TMDB_interface.urlConstructor(baseURI,this.apiKey,this.language,'original_title.desc',pageRange,this.genres,subCat,searchType,this.baseURI);
                
            
            
            }


            else{
                var letArr = [];

                for(var i = 25; i >= 0; i--){
                    var dec = 65 + i;
                    letArr.push(String.fromCharCode(dec));
                    

                }
                url = TMDB_interface.urlConstructor(baseURI,this.apiKey,this.language,letArr,page,searchType,this.baseURI);
            }
            return await TMDB_interface.fetchMultiple(url,searchConfig);  

        }
        if(criterium == 'YEAR RELEASED'){
            if(!subCat){
                var currDateMiliSecs = new Date(Date.now());
                var currDateStr = currDateMiliSecs[Symbol.toPrimitive]('string').split(' ');
                var currYear = currDateStr[3];
                url = TMDB_interface.urlConstructor(this.baseURI.mainBase,this.apiKey,this.language,currYear,searchType,pageRange,this.baseURI);
            }
            else{
                
                var currDateMiliSecs = new Date(Date.now());
                var currDateStr = currDateMiliSecs[Symbol.toPrimitive]('string').split(' ');
                var currYear = currDateStr[3];
                url = TMDB_interface.urlConstructor(this.baseURI.mainBase,this.apiKey,this.language,currYear,searchType,subCat,this.genres,pageRange,this.baseURI);

            }
        }
       
        return await TMDB_interface.fetchMultiple(url,searchConfig);  
        
    }
    
    static urlConstructor(baseURI,apiKey,language,...args)
    {
        var url;
        const URIpos = args.length - 1;
        
       
        if(baseURI == args[URIpos].mainBase){
            if(args[0] === 'popular'){
               
                if(Array.isArray(args[2])){
                    url = [];
                    for(var i = args[2][0]; i<= args[2][1]; i++ ){
                        let urlItem = baseURI + args[1] + `/${args[0]}?api_key=${apiKey}&language=${language}&page=${i}&include_adult=true`;
                        url.push(urlItem);
                        
                    }
                }
                else{
                    url = baseURI + args[1] + `/${args[0]}?api_key=${apiKey}&language=${language}&page=${args[2]}&include_adult=true`;
                }
            }
            else{
                if(Array.isArray(args[2])){
                    url = [];
                    var urlItem
                    for(var i = args[2][0]; i <= args[2][1]; i++){
                        
                        if(Array.isArray(args[args.length - 2 ][args[1]][args[0]])){
                           urlItem = baseURI + 'discover/' + `${args[1]}/` + `?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${i}&timezone=America%2FNew_York&with_genres=${args[args.length - 2][args[1]][args[0]].join('%2C')}&include_null_first_air_dates=false&with_watch_monetization_types=free`;
                    
                        }
                        else{
                            urlItem =  baseURI + 'discover/' + `${args[1]}/` +`?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${i}&timezone=America%2FNew_York&with_genres=${args[args.length -2][args[1]][args[0]]}&include_null_first_air_dates=false&with_watch_monetization_types=free`;
                        }
                        url.push(urlItem);
                    }
                }
                else{
                    if(typeof args[args.length - 2] == 'object'){
                        if(Array.isArray(args[args.length - 2 ][args[1]][args[0]])){
                            url = baseURI + 'discover/' + `${args[1]}/` + `?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${args[2]}&timezone=America%2FNew_York&with_genres=${args[args.length - 2][args[1]][args[0]].join('%2C')}&include_null_first_air_dates=false&with_watch_monetization_types=free`;
                    
                        }
                        else{
                            url = baseURI + 'discover/' + `${args[1]}/` +`?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${args[2]}&timezone=America%2FNew_York&with_genres=${args[args.length -2][args[1]][args[0]]}&include_null_first_air_dates=false&with_watch_monetization_types=free`;
                        }
                    }
                    if(typeof args[args.length -2] == 'number'){
                        url = [];
                        if(typeof args[args.length - 3] === 'object'){
                           
                            for(var i = 1; i<= args[args.length-2]; i++){
                                if(Array.isArray(args[args.length - 3][args[1]][args[2]])){
                                    var urlItem = baseURI + 'discover/' + `${args[1]}/` + `?api_key=${apiKey}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=${i}&year=${parseInt(args[0])-1}&timezone=America%2FNew_York&with_genres=${args[args.length - 3][args[1]][args[2]].join('%2C')}&include_null_first_air_dates=false&with_watch_monetization_types=free`;
                                }
                                else{
                                    
                                    var urlItem = baseURI + 'discover/' + `${args[1]}/` + `?api_key=${apiKey}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=${i}&year=${parseInt(args[0])-1}&timezone=America%2FNew_York&with_genres=${args[args.length - 3][args[1]][args[2]]}&include_null_first_air_dates=false&with_watch_monetization_types=free`;

                                }
                                url.push(urlItem);
                            }
                        }
                        else{
                            for(var i = 1; i <= args[args.length - 2]; i++){
                                var urlItem = baseURI + 'discover/' + `${args[1]}/` + `?api_key=${apiKey}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=${i}&year=${parseInt(args[0]) - 2}&with_watch_monetization_types=free`;
                                url.push(urlItem);
                            }
                        }
                    }
                    if(typeof args[args.length - 2] == 'string'){
                        url = [];
                        if(Array.isArray(args[2][args[args.length - 2]][args[3]])){
                            
                            for(var i = args[1][0]; i < args[1][1]; i++){
                               
                                let urlItem = baseURI + 'discover/' + `${args[args.length - 2]}/` +`?api_key=${apiKey}&language=en-US&sort_by=${args[0]}&include_adult=false&include_video=false&page=${i}&timezone=America%2FNew_York&with_genres=${args[2][args[4]][args[3]].join('%2C')}&include_null_first_air_date=false&with_watch_monetization_types=free`;
                                url.push(urlItem)
                            }
                        }
                        else{
                            for(var i = args[1][0]; i < args[1][1]; i++){
                                
                                let urlItem = baseURI + 'discover/' + `${args[args.length - 2]}/` +`?api_key=${apiKey}&language=en-US&sort_by=${args[0]}&include_adult=false&include_video=false&page=${i}&timezone=America%2FNew_York&with_genres=${args[2][args[4]][args[3]]}&include_null_first_air_date=false&with_watch_monetization_types=free`;
                                url.push(urlItem);
                            }
                        }
                    }
                   
                }
               
                
            }
        }
        if(baseURI == args[URIpos].tv || baseURI == args[URIpos].movie){
            if(args[0] == 'credits'){
                
                url =  baseURI + args[1] + `/credits?api_key=${apiKey}&language=${language}`;
            }
            else{
                if(Array.isArray(args[0])){
                    url = [];
                    for(var x = 0; x < args[0].length; x++){
                    
                        if(baseURI == args[URIpos].tv || baseURI == args[URIpos].movie){
                            let urlItem = baseURI + args[0][x] + `?api_key=${apiKey}&language=${language}&include_adult=false`;
                            url.push(urlItem);
                        }
                        
                    }
                }
                else{
                    url = baseURI + args[0] + `?api_key=${apiKey}&language=${language}`;
                }
            }

        }
        if(baseURI == args[URIpos].search){
            if(Array.isArray(args[0])){
                var urlItem;
                url = [];
                for(var i = 0; i< args[0].length; i++){
                    urlItem = baseURI + args[2] + `?api_key=${apiKey}&language=${language}&query=${args[0][i]}&page=${args[1]}&include_adult=false`
                    url.push(urlItem);
                }
            }
            else{   
                url = baseURI + args[2] + `?api_key=${apiKey}&language=${language}&query=${args[0]}&page=${args[1]}&include_adult=false`;
            }
        }

        
        

        return url;


    }
    async querySearch(value, searchType,page=1)
    {
        const baseURI = this.baseURI.search;
        var url;
        
        const searchConfig = this.searchConfig;
        this.searchType = searchType;
        if(searchType === 'person'){
            url = baseURI + searchType + `?api_key=${this.apiKey}&language=${this.language}&query=${value}&page=${page}$include_adult=false`;
        }
        else{
            if(this.genres[`${searchType}`][`${value}`]){
                return this.searchTvByGenre(value);
            }
        
            if(value.split(' ').length >= 2){
                value.split(' ').join('%20');
                url = TMDB_interface.urlConstructor(baseURI,this.apiKey,this.language,value,page,searchType,this.baseURI);
                
            }
            else{
                url = TMDB_interface.urlConstructor(baseURI,this.apiKey,this.language,value,page,searchType,this.baseURI);
                
            }
        }

        return await TMDB_interface.singleFetch(url,searchConfig);


    }
    async searchById(id = this.id, searchType = this.searchType)
    {
        var baseURI;
        if(searchType === 'tv'){
            baseURI = this.baseURI.tv
        }
        else{
            baseURI = this.baseURI.movie;
        }
        const searchConfig = this.searchConfig;
        const language = this.language;
        const apiKey = this.apiKey;
        
        const url = TMDB_interface.urlConstructor(baseURI,apiKey,language,id,this.baseURI);
        
        if(Array.isArray(url)){

            if(id.length > 1){
                
                return await TMDB_interface.fetchMultiple(url,searchConfig);
            }
            else{
                if(id.length === 1){
                    return await TMDB_interface.singleFetch(url[0],searchConfig);
                }
                else{
                    return id;
                }
            }
        }

        else{
            
            return await TMDB_interface.singleFetch(url,searchConfig);
        }
       
        

        

        
        
        
    }
    static async creditsFetch(url,searchConfig)
    {
        
        const myPromise = new Promise(function(resolve,reject){

            fetch(url,searchConfig)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                let castDict ={ 'cast': []};
                for(var i  = 0; i < data["cast"].length; i++){
                    if(data["cast"][i].known_for_department == 'Acting'){
                        castDict["cast"].push(data["cast"][i].original_name);
                    }
                    
                }
                resolve(castDict);
            })
            .catch( err => reject(err));




        });

        return await myPromise;
    }

    static async singleFetch(url,searchConfig)
    {   
    
        
        const promise = new Promise(function(resolve,reject){
            fetch(url,searchConfig)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                data["results"] ? data["results"].map((x) =>{ TMDB_interface.nullImgHandle(x);}): TMDB_interface.nullImgHandle(data);

                resolve(data);

            })
            .catch(function(err){
                reject(err);
            });
        });

        return await promise;
            

    }
   

    static async fetchMultiple(url,searchConfig)

    {
        
        
        const thisPromise = new Promise(function(resolve,reject){
            Promise.all(url.map((x,i)=>{
                
                return fetch(x,searchConfig);
            }))
            .then(function(responses){
                
                return Promise.all(responses.map(function(response){return response.json();}))
            })
            .then(async function(data){ 
               
               data[0]["results"] ? data.map((x) =>{ TMDB_interface.nullImgHandle(x["results"]);}): TMDB_interface.nullImgHandle(data);
               /*for(var i = 0;  i < data.length; i++){


                    if(data[i]["results"]){
                    
                
                        for(var j =0; j< data[i]["results"].length; j++){
                            if(data[i]["results"][j].poster_path && data[i]["results"][j].backdrop_path){
                                console.log(i,j);
                                
                            }
                            else{

                                data[i]["results"][j].backdrop_path ? data[i]["results"][j].poster_path = 'poster-placeHldr': data[i]["results"][j].backdrop_path = 'backdrop-placeHldr';
                                if(!data[i]["results"][j].poster_path){
                                    data[i]["results"][j].poster_path = 'poster-placeHldr';

                                }

                                
                                if(/(?<=&)page/.test(url[i].split('/')[url[i].split('/').length - 1])){

                                    
                                    
                                    let startPageLoc = url[url.length - 1].match(/(?<=page=)\d/,0);
                                    let endPageLoc = url[url.length - 1].match(/(?<=page=\d+)&/,0);

                                    let urlOffsetAtInt = url[url.length - 1].slice(startPageLoc.index,);
                                    
                                    
                                    
                                    let pageVal = parseInt(urlOffsetAtInt.split('&')[0]) + i;
                                    
                                    const masterIndex = url.length - 1;
                                    
                                    const pageRef = data[i]["total_pages"];
                                    const newData = await TMDB_interface.replaceData(url[masterIndex],startPageLoc.index, endPageLoc.index,pageVal,j,searchConfig,pageRef);
                                    
                                
                                    
                                

                                }
                            }

                            
                        }

                        
                    }
                }*/
                
                
                resolve(data);
            })
            .catch((err)=>{reject(err);});
        });
        const data = await thisPromise;
        
        /*if(url.length > 50){
            dataStore[`${JSON.stringify(url)}`] = data;
            window.localStorage['cached-data'] = JSON.stringify(dataStore);

        }*/
      
        return await thisPromise;

    }
    static nullImgHandle(data){
        if(data.length){
            for(var i = 0;  i < data.length; i++){
                
                if(data[i].backdrop_path && data[i].poster_path){

                }
                else{
                    
                    data[i].backdrop_path ? data[i].poster_path = 'poster-placeHldr': data[i].backdrop_path = 'backdrop-placeHldr';
                    if(!data[i].poster_path){
                        data[i].poster_path = 'poster-placeHldr';

                    }
                }
            }
        }
        else{
            if(data.backdrop_path && data.poster_path){

            }
            else{
                data.backdrop_path ? data.poster_path = 'poster-placeHldr': data.backdrop_path = 'backdrop-placeHldr';
                if(!data.poster_path){
                    data.poster_path = 'poster-placeHldr';

                }
            }

        }


    }

    static async replaceData(url,startPageValIndex, endPageValIndex,pageVal,dataIndex,searchConfig,pageRef)
    {    
        
        pageVal++;
        var newPageValStr;
        pageVal > pageRef ?newPageValStr = `${pageVal/pageVal + pageRef - 1}`:newPageValStr = `${pageVal}`;
        
        var newUrl = url.split('');
        
        
        var index = 0;
        do{
            newUrl[startPageValIndex] = newPageValStr.split('')[index];
            index ++;
            startPageValIndex ++;
            
            

        }
        while(startPageValIndex < endPageValIndex);
        
        if(newPageValStr.split('')[index + 1]){
            let urlLeft = newUrl.slice(0,endPageValIndex);
            let urlRight = newUrl.slice(endPageValIndex,);
            for(var i = index; i < newPageValStr.split('').length; i++){
                urlLeft.push(newPageValStr.split('')[index]);
            }
            newUrl = urlLeft.join('') + urlRight.join('');
            
        }
        
        typeof newUrl == 'object' && ( newUrl = newUrl.join(''));
        
        const data = await TMDB_interface.singleFetch(newUrl,searchConfig);
        
        startPageValIndex = newUrl.match(/(?<=page=)\d/,0);
        endPageValIndex = newUrl.match(/(?<=page=\d+)&/,0);

        var j;
        data["results"].length === 20 ? j = dataIndex: j = dataIndex % data["results"].length;
        if(pageVal > pageRef){
            j = 2;
        }
        
        
        if(data["results"][j].poster_path && data["results"][j].backdrop_path){
            return data["results"][j];
        }
        else{
            return TMDB_interface.replaceData(newUrl,startPageValIndex.index,endPageValIndex.index,pageVal,dataIndex,searchConfig,pageRef);
        }
        
        
        
        
        
        
         
         

       
    }

    
}




 
