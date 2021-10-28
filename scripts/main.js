const url = document.title.includes('Senate')
    ? 'senate' : 'house'


let init = {
    headers:{
        'X-API-Key': 'ahNWmJX0JpUuapS66UtCDadealP8CpYOCAO8tZmB'
    }
}

fetch(`https://api.propublica.org/congress/v1/113/${url}/members.json`, init)
    .then(res=>res.json())
    .then(json=>{
        let data = [...json.results[0].members]
        datos(data)
    })
    .catch(err=>console.log(err.message))

   
const datos = ((data)=>{
let miembros = data

if( document.title == "TGIF || Home"){
    let button = document.getElementById('boton')
        button.addEventListener('click', (e) => {
            button.innerText = button.innerText == 'Read More' ? 'Read Less' : 'Read More'
        })
}else{
    if(document.title == "TGIF || House" || document.title == "TGIF || Senate"){
        let politicosData = document.getElementById("politicos-data")
        let filtroPartido =  ["D", "R", "ID"]
        let filtroEstado =  "Todos"
        let nombresAMostrar = []
        let miembrosFinales = []
    
    
        function leerFiltros() {
            if(filtroEstado == "Todos") {
                nombresAMostrar = miembros
            } else {
                nombresAMostrar = miembros.filter(miembro => miembro.state == filtroEstado)
            }
            miembrosFinales= [] 
            nombresAMostrar.forEach(miembro =>{ 
                let partidoelegido = miembro.party 
                if(partidoelegido == "D" && filtroPartido.includes("D")){
                    miembrosFinales.push(miembro)
                }else if(partidoelegido == "R" && filtroPartido.includes("R")){
                    miembrosFinales.push(miembro)
                } if(partidoelegido == "ID" && filtroPartido.includes("ID")){
                    miembrosFinales.push(miembro)
                }
            })
        }
    
        function pintarTabla(){
            document.getElementById("politicos-data").innerHTML = ""
            leerFiltros()
            miembrosFinales.forEach(miembro => {
                let tablerow = document.createElement ("tr")
                let tablenombre = document.createElement ("td")
                let link = document.createElement("a")
                tablenombre.appendChild(link)
                link.href= miembro.url
                link.innerText = `${miembro.last_name}, ${miembro.first_name} ${miembro.middle_name || ""} `
                link.target = "_blank"
                tablerow.appendChild(tablenombre)
                
            
                let tableParty = document.createElement ("td")
                tableParty.innerText = miembro.party
                tablerow.appendChild(tableParty)
            
                let tableState = document.createElement ("td")
                tableState.innerText = miembro.state
                tablerow.appendChild(tableState)
            
                let tableSeniority = document.createElement ("td")
                tableSeniority.innerText = miembro.seniority
                tablerow.appendChild(tableSeniority)
                    
                let tableVote = document.createElement ("td")
                tableVote.innerText = `${miembro.votes_against_party_pct} %`
                tablerow.appendChild (tableVote)
            
                politicosData.appendChild(tablerow)
            })
        }
    
    
        pintarTabla()
    
        let estadoFiltrado =[] 
    
        miembros.forEach(miembro =>{  
            if(!estadoFiltrado.includes(miembro.state)){ 
            estadoFiltrado.push(miembro.state) 
            } 
        } )
    
        estadoFiltrado.sort()
    
        estadoFiltrado.forEach(estados =>{
            let option = document.createElement("option")
            option.innerText = estados
            option.value = estados
            document.getElementById("selectorEstado").appendChild(option)
        })
    
    
        let inputs = document.getElementsByName("partido") 
        inputs = Array.from(inputs) 
        inputs.forEach(input => { 
            input.addEventListener("change", (e) => { 
                let queInput = e.target.value
                let estaChequeado = e.target.checked
                if (filtroPartido.includes(queInput) && !estaChequeado) {
                filtroPartido = filtroPartido.filter(partido => partido !== queInput )    
                } else if (!filtroPartido.includes(queInput) && estaChequeado ){
                    filtroPartido.push(queInput)
                }
                pintarTabla()
            })
        })
    
        document.getElementById("selectorEstado").addEventListener("change" , (e) => {
            let estadoElegido = e.target.value
            filtroEstado = estadoElegido 
            pintarTabla() 
        })
    
        
    
    } else{
        const estadisticas = {
            democratas: [],
            cantidadDemocratas: 0,
            votosperdidosDemocratas: 0,
            votosLealesD: 0,
        
            independientes: [],
            cantidadIndependientes: 0,
            votosperdidosIndependientes: 0,
            votosLealesID: 0,
        
        
        
            republicanos:[],
            cantidadRepublicanos: 0,
            votosperdidosRepublicanos: 0,
            votosLealesR: 0,
        
        
            miembrosTotales: miembros.length,
            
        
            menosComprometidos: [],
            masComprometidos: [],
            menosLeales: [],
            masLeales: [],
            
        }
        
        // 
        
        estadisticas.democratas = miembros.filter(miembro => miembro.party == "D")
        estadisticas.cantidadDemocratas = estadisticas.democratas.length
        
        
        estadisticas.independientes = miembros.filter(miembro => miembro.party == "ID")
        estadisticas.cantidadIndependientes = estadisticas.independientes.length
        
        
        estadisticas.republicanos = miembros.filter(miembro => miembro.party == "R")
        estadisticas.cantidadRepublicanos = estadisticas.republicanos.length
        
        //
        let votos_per_d =[] 
        
        estadisticas.democratas.forEach(miembro => votos_per_d.push(miembro.missed_votes_pct))
        estadisticas.votosperdidosDemocratas = votos_per_d.reduce((total, miembro) => {
            return total + miembro / estadisticas.democratas.length
        }, 0)
        
        let votos_per_r = []
        estadisticas.republicanos.forEach(miembro => votos_per_r.push(miembro.missed_votes_pct))
        estadisticas.votosperdidosRepublicanos = votos_per_r.reduce((total, miembro) => {
            return total + miembro / estadisticas.republicanos.length
        }, 0)
        
        let votos_per_id = []
        
        estadisticas.independientes.forEach(miembro => votos_per_d.push(miembro.missed_votes_pct))
        estadisticas.votosperdidosIndependientes = votos_per_id.reduce((total, miembro) => {
            return total + miembro / estadisticas.independientes.length
        }, 0)
        
        let votos_leales_d = []
        
        estadisticas.democratas.forEach( miembro => votos_leales_d.push(miembro.votes_with_party_pct))
        estadisticas.votosLealesD = votos_leales_d.reduce((total, miembro) => {
            return total + miembro / estadisticas.democratas.length
        }, 0)
        
        let votos_leales_r = []
        
        estadisticas.republicanos.forEach(miembro => votos_leales_r.push(miembro.votes_with_party_pct))
        estadisticas.votosLealesR = votos_leales_r.reduce((total, miembro) => {
            return total + miembro / estadisticas.republicanos.length
        }, 0)
        
        let votos_leales_id = []
        
        estadisticas.independientes.forEach(miembro => votos_leales_id.push(miembro.votes_with_party_pct))
        estadisticas.votosLealesID = votos_leales_id.reduce((total, miembro) => {
            return total + miembro / estadisticas.independientes.length
        }, 0)
        
        //        
        let diezPorc_miembros = Math.ceil(miembros.length / 10)  
        
        let menosComprom = miembros.filter(miembro => miembro.total_votes !== 0).sort((a,b) => b.missed_votes_pct - a.missed_votes_pct) //ordena los elementos de un arreglo de 0 hasta 45
        estadisticas.menosComprometidos = menosComprom.slice(0,diezPorc_miembros)
        
        let masComprom = miembros.filter(miembro => miembro.total_votes !== 0).sort((a,b) => a.missed_votes_pct - b.missed_votes_pct) //ordena los elementos de un arreglo de 0 hasta 45
        estadisticas.masComprometidos = masComprom.slice(0,diezPorc_miembros)

        let menosL = miembros.filter(miembro => miembro.total_votes !== 0).sort((a,b) => a.votes_with_party_pct - b.votes_with_party_pct) //ordena los elementos de un arreglo de 0 hasta 45
        estadisticas.menosLeales = menosL.slice(0, diezPorc_miembros)
        
        let masL = miembros.filter(miembro => miembro.total_votes !== 0).sort((a,b) => b.votes_with_party_pct - a.votes_with_party_pct) //ordena los elementos de un arreglo de 0 hasta 45
        estadisticas.masLeales = masL.slice(0, diezPorc_miembros)
        

        function crearTabla(nombre, cantidadD, porcentaje){
            let fila = document.createElement("tr")
        
            let columna = document.createElement("td")
            let columnaDos = document.createElement("td")
            let columnaTres = document.createElement("td")
        
            columna.innerText = nombre
            columnaDos.innerText = cantidadD || "-"
            columnaTres.innerText = porcentaje
            var tableBody = document.getElementById("tablaUno")
            fila.appendChild(columna)
            fila.appendChild(columnaDos)
            fila.appendChild(columnaTres)
            tableBody.appendChild(fila)
                
        }

        function pintarTabla( propiedad, padre){
            estadisticas[propiedad].forEach((miembro) =>{
                let fila = document.createElement ("tr")
                let columna = document.createElement ("td")
                let columnaDos = document.createElement ("td")
                let columnaTres = document.createElement ("td")
                let link = document.createElement("a")

                link.href= miembro.url 
                columna.appendChild(link)
                link.innerText = `${miembro.last_name}, ${miembro.first_name} ${miembro.middle_name || ""} `
                link.target = "_blank"
               
                fila.appendChild(columna)
                fila.appendChild(columnaDos)
                fila.appendChild(columnaTres)
                var tableBody = document.getElementById("tablaDos")
        
                document.getElementById(padre).appendChild(fila)
                if(document.title.includes("Attendance")){
                    columnaDos.innerText = miembro.missed_votes
                    columnaTres.innerText = `${miembro.missed_votes_pct} %`
                }else{
                    columnaDos.innerText = `${Math.round((miembro.total_votes - miembro.missed_votes) * miembro.votes_with_party_pct /100)} ` 
                    columnaTres.innerText = `${miembro.votes_with_party_pct.toFixed(2)} %`
                }
        
            })
        
            
        }
        
        
        if (document.title.includes("Attendance")) {
            crearTabla("Democrats", estadisticas.cantidadDemocratas, estadisticas.votosperdidosDemocratas.toFixed(2) + "%")
            crearTabla("Republicans", estadisticas.cantidadRepublicanos, estadisticas.votosperdidosRepublicanos.toFixed(2) + "%" )
            crearTabla("Independants", estadisticas.cantidadIndependientes, estadisticas.votosperdidosIndependientes.toFixed(2) + "%")
            crearTabla("Total",estadisticas.miembrosTotales, "-")
            pintarTabla("menosComprometidos", "tablaDos" )
            pintarTabla("masComprometidos", "tablaTres")

        
        }else{
            crearTabla("Democrats", estadisticas.cantidadDemocratas, estadisticas.votosLealesD.toFixed(2) + "%")
            crearTabla("Republicans", estadisticas.cantidadRepublicanos, estadisticas.votosLealesR.toFixed(2) + "%")
            crearTabla("Independants", estadisticas.cantidadIndependientes, estadisticas.votosLealesID.toFixed(2) + "%")
            crearTabla("Total", estadisticas.miembrosTotales, "-" )
            pintarTabla("menosLeales", "tablaDos" )
            pintarTabla("masLeales", "tablaTres")
        }
        
        
        






       



        


        







    }
}
})