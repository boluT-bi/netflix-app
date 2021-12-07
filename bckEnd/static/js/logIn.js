

async function background(){
    var myPromise = new Promise(function(myResolve,myReject){
        const context = {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers:{
                'Content-Type':'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
            
        };

        Promise.all([fetch("https://api.themoviedb.org/3/tv/popular?api_key=faf9f1a7200447079dd513898ac80175&language=en-US&page=1", context),
        fetch("https://api.themoviedb.org/3/tv/popular?api_key=faf9f1a7200447079dd513898ac80175&language=en-US&page=2",context),fetch("https://api.themoviedb.org/3/tv/popular?api_key=faf9f1a7200447079dd513898ac80175&language=en-US&page=3",context)])
        .then(function(responses){
           return Promise.all(responses.map((response)=>{

               return response.json();

            }));
        })
        .then(function(data){
            var dataC = data[0]["results"].slice();
            for(var i = 1;i<data.length;i++){
                dataC = dataC.concat(data[i]["results"]);


            }
            const newData = dataC
            
            myResolve(newData);

        })
        .catch((err)=>{
            myReject(err);
        });

    });
    var data = myPromise;
    var divLib = {};
    for(var  i = 1 ; i < 9; i++){
         divLib[`div${i}`] = document.createElement('div');
         divLib[`div${i}`].style.position = 'absolute';
         divLib[`div${i}`].style.left = '0';
         divLib[`div${i}`].style.top = `calc(206px *${i-1})`;
         divLib[`div${i}`].style.width = '2000px';
         divLib[`div${i}`].style.height = '200px';
         divLib[`div${i}`].className = 'rowDsply';
         divLib[`div${i}`].id = `div${i}`;
         divLib[`div${i}`].setAttribute('data-index', i-1);
         

         


    }
   
      
    
    
    
    data.then(function(result){
        
        var docFrag = document.createDocumentFragment();
        for(var i = 0; i<result.length;i++){
            var img = document.createElement('img');
            
            img.src = `https://images.tmdb.org/t/p/original${result[i].poster_path}`;
            img.style.width = '6%';
            img.style.height = '100%';
            img.style.paddingRight = '6px';
            img.className = 'imgObject';
            img.style.opacity = '0.7';
            if(i% 11 == 0|| i% 3 == 0 && i != 0){
                img.style.width = '12%';
            }
            if( i < 8){
                divLib['div1'].appendChild(img);
            }
            if( i%8 == 0){
                var x = i;
                var setDiv = divLib[`div${1+i/8}`];
                setDiv.appendChild(img);
            }
            else{
                setDiv.appendChild(img);
                
                
            }
           
           
         
            
        
    
        }
        for(var i = 1; i < 9 ; i++){
            docFrag.appendChild(divLib[`div${i}`]);
        }
        
        var pNode = document.querySelector('.customBg').firstElementChild;
        pNode.appendChild(docFrag);
    

    });
  

}background();

function validityCheck(){
    var nodeInQuestion = document.getElementsByTagName('label');
    document.addEventListener('DOMContentLoaded', function(){
        var userNode = nodeInQuestion.item(0).firstElementChild;
        nodeInQuestion.item(0).firstElementChild.value = null;
        userNode.value = null;
        var inputString = '';
        Node.prototype.displayDiv = function(){
            for(var i = 0; i < this.childNodes.length;i++){
                if(this.childNodes[i].tagName == 'div'.toUpperCase()){
                    if(i > 1){
                        this.childNodes[i].style.display = 'flex';
                        
                    }
                    else{
                        this.childNodes[i].classList.add("nfErr");
                    }
                    
                }
            }
        }
        
        Node.prototype.hideDiv = function(){
            for(var i = 0; i < this.childNodes.length;i++){
                if(this.childNodes[i].tagName == 'div'.toUpperCase()){
                    if(i> 1){
                    this.childNodes[i].style.display = 'none';
                    }
                    else{
                        this.childNodes[i].classList.remove("nfErr");
                    }
                }
            }
            

        }
        Node.prototype.displayyDiv = function(){
            for(var i = 0; i < this.childNodes.length;i++){
                if(this.childNodes[i].tagName == 'div'.toUpperCase()){
                    if(i > 1){
                        this.childNodes[i].style.display = 'flex';
                        this.childNodes[i].firstElementChild.textContent = 'password should be 8 to 60 characters long';

                    }
                    else{
                        this.childNodes[i].classList.add("nfErr");
                    }
                   
                }
            } 
        }
        document.addEventListener("click", function(){
            if(document.activeElement == userNode){
               var node = userNode.parentElement;
               

               node.parentElement.style.backgroundColor = '#696969';
               node.parentElement.firstElementChild.style.top = '5%';
               node.parentElement.firstElementChild.firstElementChild.style.fontSize = '10px';
               
               
               
               

            }
            else{
                var node = userNode.parentElement;
                node.parentElement.style.backgroundColor = '#333';
                if(userNode.value == ''){
                    node.parentElement.firstElementChild.style.top = '50%';
                    node.parentElement.firstElementChild.firstElementChild.style.fontSize = '16px';
                }
               

            }
            if(document.activeElement == nodeInQuestion.item(1).firstElementChild){
                var node = nodeInQuestion.item(1).parentElement;
                console.log(node);
                node.style.backgroundColor = '#696969';

                node.firstElementChild.style.top = '5%';
                node.firstElementChild.firstElementChild.style.fontSize = '10px';
                
                
 
            }
            else{
                var node = nodeInQuestion.item(1).parentElement;
                node.style.backgroundColor = '#333';

                if(nodeInQuestion.item(1).firstElementChild.value == ''){
                    node.firstElementChild.style.top = '50%';
                    node.firstElementChild.firstElementChild.style.fontSize = '16px';
                }
               
 
            }

            
        });
    

    });

       
    
    
    
    
}validityCheck();

