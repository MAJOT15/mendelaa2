 var typ = null,
     tura = null,
     main_interval;

 function init() {
     dodaj_usera();
     daj_status();


 }

 function resetuj() {
     wyslij({
         "akcja": "resetuj"
     });
     location.reload();

 }

 function select_OX(typ) {
     wyslij({
         "akcja": "set_OX",
         "typ": typ,
         "id_usera": id_usera,
     });

 }

 function dodaj_usera() {
     wyslij({
         "akcja": "dodaj_usera"
     });
 }

 function update_map() {
     wyslij({
         "akcja": "get_map",
         "id_usera": id_usera
     });
 }



 function resolve_data(odpowiedz) {
     console.log(odpowiedz);
     var message_box = document.getElementById("messages");
     odpowiedz = JSON.parse(odpowiedz);
     if (odpowiedz.abort) {
         clearInterval(main_interval);
         abort();
     }
     if (odpowiedz.gotowy || !odpowiedz.gotowy && odpowiedz.gotowy !== undefined) {
         if (id_usera === undefined) {
             id_usera = odpowiedz.id_usera;

         }
         message_box.innerText = odpowiedz.wiadomosc;                           
         if (odpowiedz.gotowy) {                                            
             wybierz_OX();
         }
     }
     if (odpowiedz.start) {            

         usun_OX();
         nowy_status(odpowiedz);
         tura = odpowiedz.tura;
         typ = odpowiedz.typ;

     }
     if (odpowiedz.update) {  
         update_map();
     }
     if (odpowiedz.new_map) {     
         nowa_mapa(odpowiedz.map);
     }
     if (odpowiedz.koniec) {        
         clearInterval(main_interval);
         setTimeout(() => {
             message_box.innerText = "Gra zrestartuje się za 2 sekundy";
             setTimeout(() => {
                 resetuj();
             }, 2000);
         }, 500);
     }
 }


 function daj_status() {

     setTimeout(() => {
         main_interval = setInterval(() => {
             wyslij({
                 "akcja": "daj_status",
                 "id_usera": id_usera
             });
         }, 1000);
     }, 500);

 }

 function dodaj_OX(x, y) {
     console.log(tura);
     if (tura) {
         console.log(typ);
         var field = document.getElementById(x + "_" + y);
         field.innerText = typ;
         field.onclick = "";
         wyslij({
             "akcja": "move",
             "id_usera": id_usera,
             "x": x,
             "y": y
         });
     }


 }





 function wyslij(data) {
     var ajax = new XMLHttpRequest();


     ajax.onreadystatechange = function () {
         if (this.readyState == 4 && this.status == 200) {
             resolve_data(this.response);
         }
     };
     ajax.open("POST", "/", true);
     ajax.setRequestHeader("Content-type", "application/json");
     ajax.send(JSON.stringify(data));



 }



 function abort() {
     document.body.innerText = "Nie może być większej ilości graczy";
     this.style.color = "white";
 }

 function  wybierz_OX() {
     var container = document.getElementById("ox");
     container.innerHTML = "";
     var o = document.createElement("button");
     o.id = "O";
     o.textContent = "O";
     o.onclick = () => {
         select_OX("O");
     };

     var x = document.createElement("button");
     x.id = "X";
     x.textContent = "X";
     x.onclick = () => {
         select_OX('X');
     };

     container.appendChild(x);
     container.appendChild(o);
 }

 function usun_OX() {
     document.getElementById("ox").innerHTML = "";
 }

 function nowy_status(odpowiedz) {
     var wiadomosc = document.getElementById("messages");
     if (odpowiedz.tura) {
         wiadomosc.innerText = "Twoja kolej. Grasz " + odpowiedz.typ;
     } else {
         wiadomosc.innerText = "Kolej przeciwnika. Grasz " + odpowiedz.typ;
     }
     if (odpowiedz.koniec !== undefined) {
         wiadomosc.innerText = odpowiedz.wiadomosc;
     }
 }

 function nowa_mapa(map) {
     for (var i = 0; i < 3; i++) {
         console.log(map);

         for (var a = 0; a < 3; a++) {
             var field = document.getElementById(i + "_" + a);
             if (map[i][a] !== 0) {
                 field.innerText = map[i][a];
                 field.removeAttribute("onclick");
             }
         }

     }
 }