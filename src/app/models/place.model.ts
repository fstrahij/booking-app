export class Place {
    constructor(public id: string,
                public title: string,
                public description: string,
                public imageUrl: string,
                public price: number,
                public dateFrom: Date,
                public dateTo: Date,
                public userId: string
    ) {}
}

export interface PlaceData{
    title: string,
    description: string,
    price: number,
    imageUrl: string,
    userId: string,
    dateFrom: string,
    dateTo: string,
}