var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    path = require("path"),
    user = require("./user"),
    map = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ],
    users = [];





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', express.static(path.join(__dirname, '/static')));
app.get("*", (req, res) => {
    res.sendFile("static/index.html", {
        root: __dirname
    });
});
app.post("/", (req, res) => {
    console.log(req.body);
    switch (req.body.akcja) {
        case "resetuj":
            users = [];
             map = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ],
            res.send("DONE");
            break;                                                                  
        case "dodaj_usera":
            users.push(new user(0, 0));
            if (users.length < 2) { 
                res.send({
                    "wiadomosc": "Oczekiwanie na 2giego gracza",
                    "gotowy": false,
                    "id_usera": 0,
                });
            } else if (users.length == 2) {
                res.send({
                    "wiadomosc": "Wybierz OX",
                    "gotowy": true,
                    "id_usera": 1,
                });
            } else {
                res.send({ 
                    "abort": true
                });
            }

            break;
        case "daj_status":
            if (users.length < 2) {                              
                res.send({
                    "wiadomosc": "zaczekaj na 2giego gracza",
                    "gotowy": false
                });
            } else if (users[0].typ === 0 || users[1].typ === 0 && users.length == 2) {
                res.send({
                    "wiadomosc": "Wybierz OX",
                    "gotowy": true,
                });
            } else if (users[0].typ !== 0 && users[1].typ !== 0) { 
                var other;
                if(req.body.id_usera === 1){ 
                    other = 0;
                }else{
                 other = 1;       
                }
                if(sprawdz_mape(users[req.body.id_usera].typ)){                    
                    res.send({
                        "wiadomosc": "Wygrałeś!",
                        "koniec": true,
                        "start": true,
                    });
                }else if(sprawdz_mape(users[other].typ)){                          
                    res.send({
                        "wiadomosc": "Przeciwnik wygrał",
                        "koniec": true,
                        "start": true,
                        "update": users[req.body.id_usera].aktualizacja,

                    });
                }else{                                                                  
                res.send({
                    "tura": users[req.body.id_usera].tura,
                    "typ": users[req.body.id_usera].typ,
                    "update": users[req.body.id_usera].aktualizacja,
                    "start": true,
                });
                }
            }

            break;
        case "set_OX":

            if (req.body.id_usera === 0) {  
                users[0].typ = req.body.typ;
                users[0].tura = false;
                if (req.body.typ === "O") {
                    users[1].typ = "X";
                    users[1].tura = true;
                } else {
                    users[1].typ = "O";
                    users[1].tura = true;
                }
            } else if (req.body.id_usera === 1) { 
                users[1].typ = req.body.typ;
                users[1].tura = false;
                if (req.body.typ === "O") {
                    users[0].typ = "X";
                    users[0].tura = true;
                } else {
                    users[0].typ = "O";
                    users[0].tura = true;
                }
            }
            res.send({
                "tura": users[req.body.id_usera].tura,
                "typ": users[req.body.id_usera].typ,
                "start": true,
            });
            break;
        case "get_map":
            users[req.body.id_usera].aktualizacja = false;
            res.send({
                "new_map": true,
                map: map
            });
            break;
        case "move":
            if (req.body.id_usera === 0) {
                users[0].tura = false;
                users[1].tura = true;
                users[1].aktualizacja = true;
            } else {
                users[1].tura = false;
                users[0].tura = true;
                users[0].aktualizacja = true;
            }
            map[req.body.x][req.body.y] = users[req.body.id_usera].typ;
           
             res.send({
                "tura": users[req.body.id_usera].tura,
                "typ": users[req.body.id_usera].typ,
                "start": true,
            });
            
            break;

        default:

    }
});

function sprawdz_mape(typ){                                                     
    if((map[0][0] == typ && map[0][1] == typ && map[0][2] == typ) ||
       (map[1][0] == typ && map[1][1] == typ && map[1][2] == typ) ||
       (map[2][0] == typ && map[2][1] == typ && map[2][2] == typ) ||
       (map[0][0] == typ && map[1][0] == typ && map[2][0] == typ) ||
       (map[0][1] == typ && map[1][1] == typ && map[2][1] == typ) ||
       (map[0][2] == typ && map[1][2] == typ && map[2][2] == typ) ||
       (map[0][0] == typ && map[1][1] == typ && map[2][2] == typ) ||
       (map[0][2] == typ && map[1][1] == typ && map[2][0] == typ)){
           return true;
    }
}
app.listen(process.env.PORT || 3000);