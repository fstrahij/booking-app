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