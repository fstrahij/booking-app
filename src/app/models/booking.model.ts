export class Booking {
    constructor(public id: string,
                public placeId: string,
                public placeTitle: string,
                public placeImage: string,
                public firstName: string,
                public lastName: string,
                public guestNumber: number,
                public guestId: string,
                public dateFrom: Date,
                public dateTo: Date,
    ) {}
}

export interface BookingData{
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    guestId: string,
    dateFrom: string,
    dateTo: string,
}