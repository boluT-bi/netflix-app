//for memory refresh

 /*var db;
                let request = window.indexedDB.open(`${document.getElementById('profile-user').value}_db`,1);

                request.onerror = function(){
                    console.log('failed to open database');

                }
                request.onupgradeneeded = function(e){
                    db = e.target.result;
                    var objectStore = db.createObjectStore(`${document.getElementById('profile-user').value}_os`,{keypath: 'id',autoIncrement: true});
                    objectStore.createIndex('genre','genre',{unique:false});
                    objectStore.createIndex('item_id','item_id',{unique:false});
                    objectStore.createIndex('image_link','image_link',{unique:false});
                    objectStore.createIndex('name','name',{unique:false});
                    objectStore.createIndex('synopsis','synopsis',{unique:false});
                    

                }
                request.onsuccess = function(){
                    db = request.result;
                    
                    var nodeExtracted = document.getElementsByClassName('elaborateCard--info').item(0);
                    console.log(nodeExtracted.firstElementChild);
                    var newItem = {genre:nodeExtracted.firstElementChild.nextElementSibling.nextElementSibling.textContent,
                        item_id: e.target.id,
                        image_link: e.target.src,
                        name:nodeExtracted.firstElementChild.textContent,
                        synopsis:nodeExtracted.firstElementChild.nextElementSibling.textContent
                        
                    };
                    var transaction = db.transaction(`${document.getElementById('profile-user').value}_os`,'readwrite');
                    var objectStore = transaction.objectStore(`${document.getElementById('profile-user').value}_os`);
                    request = objectStore.add(newItem);
                    
                } */  



// BST
/*export class Node{
    constructor(data = 0, left = null, right = null){
        this.data = data;
        this.right = right;
        this.left = left;
    }



    createTreeUtil(arr,index,low,high,size){
        if(index >= size || low > high){
            return null;
        }
        var root = new Node(arr[index]);
        index += 1;
        if(low == high){
            return root;
        }
        var i;
        for(i = low; i <= high; i++){
            if(arr[i] > root.data){
                break;
            }
        }

        root.left = createTreeUtil(arr,index,index,i-1,size);

        root.right = createTreeUtil(arr,index,i,high,size);
        
        return root;
        

    }
    createTree(arr,size){
        var index = 0;
        return createTreeUtil(arr,index,0,size-1,size);
    }

    

    
}*/

