import { EtapeModel } from '@/models/EtapeModel';
import { formatDuration, intervalToDuration, Duration, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

export function DateTimeToString(date: Date){
    var newDate = new Date(date);
    if(newDate){
        return newDate.toLocaleString("fr-FR");
    }
    return "Aucune date";
}

export function DateToString(date: Date){
    var newDate = new Date(date);
    if(newDate){
        return newDate.toLocaleDateString("fr-FR");
    }
    return "Aucune date";
}

export function DurationDateTimeToString(startDate?: Date, endDate?: Date ) {
    if(startDate && endDate){        
        const duration: Duration = getDuration(startDate,endDate)
        const valeur: string = DurationToString(duration);
        return valeur;
    }
    return "Aucune durée";

}

function getDuration(startDate: Date, endDate: Date): Duration{
    const startDate2: Date = new Date(startDate);
    const endDate2: Date = new Date(endDate);
    if(isValid(startDate2) && isValid(endDate2)){
        const duration = intervalToDuration({ start: startDate2, end: endDate2 });
        return duration;
    }
    let totalDuration: Duration = {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    return totalDuration;
    
}

export function getParcoursDuration(etapes: Array<EtapeModel>): String{
    let totalDuration: Duration = {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };

    for(const etp of etapes){
        if(etp.startDate && etp.endDate){
            const duration : Duration = getDuration(etp.startDate,etp.endDate);
            totalDuration.years! += duration.years!;
            totalDuration.months! += duration.months!;
            totalDuration.days! += duration.days!;
            totalDuration.hours! += duration.hours!;
            totalDuration.minutes! += duration.minutes!;
        }
    }
    
    return DurationToString(totalDuration);
}

function DurationToString(duration: Duration): string{
    
    if(duration){
        const formattedDuration: string = formatDuration(duration, {
            format: ['years', 'months', 'days', 'hours', 'minutes'],
            delimiter: ' ',
            zero: false,
            locale: fr
          });
        return formattedDuration;
        
    }

    return "Aucune durée";

}