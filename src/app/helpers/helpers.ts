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
