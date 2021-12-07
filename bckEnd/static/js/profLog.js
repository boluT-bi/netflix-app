function manageDisplay(){


    const node = document.getElementsByClassName('profileObject');
    const profEditIcon = document.getElementsByClassName('fa-edit');
    const  aNodes = document.getElementsByClassName('profToMain');
    
    const callerNode = document.querySelector('.profileManage-btn-ctnr').firstElementChild;
    if(node.item(0).firstElementChild.style.opacity == '0.5'){
        callerNode.textContent = 'MANAGE PROFILES';
        callerNode.style.border = '2px solid #333';
        callerNode.style.color = '#333';

        Array.prototype.forEach.call(node,function(n){
            n.firstElementChild.style.opacity = '1.0';
        });
        Array.prototype.slice.call(aNodes).map(x => x.style.display = 'block');
        document.getElementsByClassName('hTitle').item(0).firstElementChild.textContent = "Who's watching ?";
        [].forEach.call(profEditIcon, function(icon){
            icon.style.display = 'none';
        });
        

       
        
      
    }
    else{
        Array.prototype.forEach.call(node,function(n){
            n.firstElementChild.style.opacity = '0.5';
        });
        Array.prototype.slice.call(aNodes).map(x => x.style.display = 'none');
        callerNode.textContent = 'Done';
        callerNode.style.border = '2px solid #ffff';
        callerNode.style.color = '#ffff';
        document.getElementsByClassName('hTitle').item(0).firstElementChild.textContent = "Manage Profiles:";
        [].forEach.call(profEditIcon, function(icon){
            icon.style.display = 'block';
        });
    }
    
    
    
}



Node.prototype.findSecondToLast = function(){
    for(var i = 0; i < this.childNodes.length; i++){
        if(this.childNodes[i].tagName == 'div'.toUpperCase()){
            var secondToLastNode = this.childNodes[i];
            break;
        }
    }
    return secondToLastNode;
}

function sendProfile(){
    
   document.getElementsByClassName('profForm').item(0).submit();
       
}

