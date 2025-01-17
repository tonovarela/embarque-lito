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
