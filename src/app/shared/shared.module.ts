import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
    BsDatepickerModule,
    BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker'; 
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { MultiSelectModule } from 'primeng/multiselect';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LightgalleryModule } from 'lightgallery/angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgxMaskModule } from 'ngx-mask';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgChartsModule } from 'ng2-charts';
import { LightboxModule } from 'ngx-lightbox';
import { ChipsModule } from 'primeng/chips';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { DateRangePickerModule } from './common/date-range-picker/date-range-picker.module';
import { CollapseHeaderModule } from './common/collapse-header/collapse-header.module';
import { ReloadComponent } from './components/reload/reload.component';
import { CustomPaginationModule } from './components/custom-pagination/custom-pagination.module'; 
import { ShortenAmountPipe } from './pipes/shorten-amount.pipe';
import {NgxPrintModule} from 'ngx-print';


@NgModule({
    declarations: [
        ReloadComponent, 
        ShortenAmountPipe,
    ],
    exports: [
        CommonModule,
        NgScrollbarModule,
        NgApexchartsModule,
        BsDatepickerModule,
        CustomPaginationModule,
        HttpClientModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule,
        NgxEditorModule,
        MultiSelectModule,
        CollapseHeaderModule,
        CarouselModule,
        LightgalleryModule,
        FullCalendarModule,
        ToastModule,
        TooltipModule,
        PopoverModule,
        NgxMaskModule,
        NgxDropzoneModule,
        NgChartsModule,
        LightboxModule,
        ChipsModule,
        EditorModule,
        DateRangePickerModule,
        DropdownModule,
        TimepickerModule,
        NgxMatTimepickerModule,
        NgxPrintModule,

        ReloadComponent,
        ShortenAmountPipe,
        
    ], imports: [
        CommonModule,
        NgScrollbarModule,
        NgApexchartsModule,
        BsDatepickerModule,
        CustomPaginationModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        NgxEditorModule,
        MultiSelectModule,
        CollapseHeaderModule,
        CarouselModule,
        LightgalleryModule,
        FullCalendarModule,
        ToastModule,
        TooltipModule,
        PopoverModule,
        NgxMaskModule.forRoot({
            showMaskTyped: false,
        }),
        NgxDropzoneModule,
        NgChartsModule.forRoot(),
        LightboxModule,
        ChipsModule,
        EditorModule,
        DateRangePickerModule,
        DropdownModule,
        TimepickerModule.forRoot(),
        NgxMatTimepickerModule,
        NgxPrintModule,
    ],
    providers: [
        BsDatepickerConfig,
        DatePipe,
        BsDaterangepickerConfig,
        provideHttpClient(withInterceptorsFromDi()),
        ShortenAmountPipe,
    ]
})
export class SharedModule { }
