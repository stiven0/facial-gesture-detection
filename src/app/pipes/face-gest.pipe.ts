import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'faceGest'
})
export class FaceGestPipe implements PipeTransform {

    transform(value: string): string {
        
        switch (value) {

            case 'angry':
                return 'enfadada (o)';

            case 'disgusted':
                return 'disgustada (o)';

            case 'fearful':
                return 'disgustada (o)';

            case 'disgusted':
                return 'disgustado';

            case 'happy':
                return 'feliz';

            case 'neutral':
                return 'neutral';

            case 'sad':
                return 'triste';

            case 'surprised':
                return 'sorprendida (o)';
        
            default:
                return '';

        }

    }

}