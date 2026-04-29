import { Injectable } from '@angular/core';
import { ImportSummary } from '../core/interfaces/import-summary.interface';
import { ImportResult } from '../core/interfaces/import-result.interface';
import { ImportSummaryBuilder } from '../core/helpers/import-summary-builder.helper';

@Injectable({ providedIn: 'root' })
export class ImportSummaryService {
  private readonly builder = new ImportSummaryBuilder();

  summarize(result: ImportResult): ImportSummary {
    return this.builder.build(result.imported.length, result.discarded);
  }
}
