import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";


@Injectable({
    providedIn:"root"
})
export class CommonService {
    constructor(private sanitizer: DomSanitizer) {}

    sanitizeImageData(imageData: string | undefined): SafeUrl | undefined {
        return imageData ? this.sanitizer.bypassSecurityTrustUrl(imageData) : undefined;
      }
    
}