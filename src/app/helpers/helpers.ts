import { FormGroup } from "@angular/forms";

export const  unirFechaHora=(date: Date, hora: string): Date=> {
    if (date == null || hora == null) {
      return new Date();
    }
    const dia = (date.getDate());
    const mes = date.getMonth() + 1
    const anio = date.getFullYear();
    const [horas, minutos] = hora.split(':').map(Number);
    return new Date(anio, mes - 1, dia, horas, minutos);
  }


  export const  formatDate =(date: Date, time: string | null = null): string=> {
    const dia = ('0' + date.getDate()).slice(-2);
    const mes = ('0' + (date.getMonth() + 1)).slice(-2);
    const anio = date.getFullYear();
    const fechaCadena = `${anio}-${dia}-${mes} ${time === null ? '' : time}`;
    return fechaCadena;
  }


   export const  convertirACadenaFecha=(fecha: string, hora: string): Date =>{
    const [year, month, day] = fecha.split('-').map(Number);
    const [hours, minutes] = hora.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }


 export const  tieneErrorForm=(name:string,form:FormGroup):boolean=>{
    const control = form.get(name);
    return (control && control.errors) && (control.dirty || control.touched) ? true : false;
}



export const onInputNumberValidate=(event: any,field:string,form:FormGroup)=>{
  const target = event.target as HTMLInputElement;
   let newValue = target.value;         
   target.value =!isNaN(+newValue)?newValue:"";               
   form.get(field)!.setValue(target.value);
  
}

export const onFocusNumberValidate=(event: any,field:string,form:FormGroup)=>{
  const target = event.target as HTMLInputElement;
   let newValue = target.value;         
   if (newValue == "0") {
     target.value = "";
   }
   form.get(field)!.setValue(target.value);
}


export const obtenerColorTransporte = (id_transporte:number): string => {

  const colores = [
    "#FF0000", // Rojo brillante    
    "#0000FF", // Azul brillante
    "#FFFF00", // Amarillo brillante
    "#FF00FF", // Magenta
    "#00FFFF", // Cian    
    "#800080", // Púrpura
    "#FFC0CB", // Rosa
    "#00FF7F", // Verde primavera
    "#FF4500", // Naranja rojizo
    "#1E90FF", // Azul Dodger
    "#FFD700", // Oro
    "#ADFF2F", // Verde amarillo
    "#FF1493", // Rosa profundo    
    "#00BFFF", // Azul profundo
    "#FF6347", // Tomate
    "#7FFF00", // Verde chartreuse
  ];
  const index= colores.at(id_transporte)!;
  if (index == undefined) {   
    return "#000000"; // Color por defecto si no se encuentra el id_transporte
  }
  return colores[id_transporte]; // Devuelve el color correspondiente al id_transporte


  

  

}
