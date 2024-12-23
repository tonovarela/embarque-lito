function translateCalendar() {
    setTimeout(() => {
        let locales = {
            pl: {
                days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                today: "Hoy",
                monthsTitle: "Meses",
                clear: "Borrar",
                weekStart: 1,
                format: "dd.mm.yyyy"
            }
        };
        let flowbitePickers = Object.values(FlowbiteInstances.getInstances("Datepicker")).map((instance) => {
            return instance.getDatepickerInstance();
        });
        for (const flowbitePicker of flowbitePickers) {
            for (const picker of flowbitePicker.datepickers || [flowbitePicker]) {
                Object.assign(picker.constructor.locales, locales);
                picker.setOptions({ language: "pl" });
            }
        }
    }, 100);
}