export class Place {
    constructor(public id: string,
                public title: string,
                public description: string,
                public imageUrl: string,
                public price: number,
                public dateFrom: Date,
                public dateTo: Date,
                public userId: string,
                public address?: string,
                public lat?: number,
                public lng?: number,
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
    address?: string,
    lat?: number,
    lng?: number,
}