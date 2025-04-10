import { Component, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { PageSettingsModel, FilterSettingsModel, GridComponent, ReorderService, ExcelExportService, FilterService, PageService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { SynfusionModule } from '@app/lib/synfusion.module';





@Component({
    template: '',
    standalone: true,
    providers: [ReorderService, ExcelExportService, ToolbarService, PageService, FilterService],
    imports: [SynfusionModule]
})
export abstract class BaseGridComponent implements OnDestroy {

    @ViewChild('grid') protected grid!: GridComponent;
    protected autoFitColumns: boolean = true;
    
    protected pageSettings: PageSettingsModel = { pageSizes: true, pageSize: 30 };
    protected filterSettings: FilterSettingsModel = { type: "CheckBox" };
    protected subsriptions: Subscription[] = [];
    heightGrid: number = 0;


    private _resizeObservable$: Observable<Event> = new Observable<Event>();

    public ResizeHeight() {
        this._resizeObservable$ = fromEvent(window, 'resize')
        return this._resizeObservable$;
    }
    protected iniciarResizeGrid(porcentaje: number) {
        
        if (window.innerHeight >= 1000) {
            porcentaje = 0.18;
        }
        this.heightGrid = window.innerHeight - (window.innerHeight * porcentaje);
        const subs1 = this.ResizeHeight().subscribe(x => {
            if (window.innerHeight >= 1000) {
                porcentaje = 0.18;
            }
            this.heightGrid = window.innerHeight - (window.innerHeight * porcentaje);
            this.dataBound();
        });
        this.subsriptions.push(subs1);
    }

    ngOnDestroy(): void {
        this.subsriptions.forEach(s => s.unsubscribe());
    }


    protected dataBound() {

        if (!this.autoFitColumns) {
            return;
        }
        if (this.grid == undefined){
            return;
        }
        this.grid.resizeSettings = { mode: 'Auto' }
        this.grid.autoFitColumns();
        if (window.innerWidth < 2000) {
            this.grid.autoFitColumns();
        } else {
            this.grid.resizeSettings = { mode: 'Auto' }
        }
    }

}