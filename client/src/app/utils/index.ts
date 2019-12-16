import * as moment from 'moment';

export const getFormattedDate = (date: Date): string => {
    return moment(date).format("d/M/Y, h:mm a");
};
