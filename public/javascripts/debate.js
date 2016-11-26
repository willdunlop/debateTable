

function compOptionsVisible() {
   var d = document.getElementById("comparitiveOptions");
   if(d.style.display == 'block' ) {
     d.style.display = 'none';
   } else if (d.style.display == 'none') {
     d.style.display = 'block'
   }  else {
     d.style.display = 'none';
   }
 };

document.getElementById("inputComparitive").addEventListener("click", compOptionsVisible);
