// src/app/core/jkc-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import {
    formatJkcDate,
    JkcDateFormatOptions,
} from './jkc-date.util';

@Pipe({
    name: 'jkcDate',
    standalone: true,
    pure: true,
})
export class JkcDatePipe implements PipeTransform {
    transform(
        value: Date | string | number | null | undefined,
        options?: JkcDateFormatOptions
    ): string {
        return formatJkcDate(value, options);
    }
}
